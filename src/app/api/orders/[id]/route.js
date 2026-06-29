import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const data = await request.json();

    const order = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!currentOrder) {
        throw new Error('Order not found');
      }

      if (data.status === 'CANCELLED' && currentOrder.status !== 'CANCELLED') {
        // Cancelled: restore inventory
        for (const item of currentOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      } else if (data.status !== 'CANCELLED' && currentOrder.status === 'CANCELLED') {
        // Un-cancelled: reserve inventory again
        for (const item of currentOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: { status: data.status },
        include: {
          items: { include: { product: true } },
        },
      });

      // TRIGGER GOOGLE SHEETS WEBHOOK ON COMPLETION
      if (data.status === 'COMPLETED' && currentOrder.status !== 'COMPLETED') {
        const webhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL;
        if (webhookUrl) {
          try {
            const itemsSubtotal = updatedOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const rawDeliveryFee = updatedOrder.total + updatedOrder.discountAmount - itemsSubtotal;
            const deliveryFee = rawDeliveryFee > 0 ? Math.round(rawDeliveryFee * 100) / 100 : 0;
            
            const rows = updatedOrder.items.map(item => {
              const rowData = Array(11).fill(""); // A through K (0 to 10)
              rowData[2] = item.product.name; // C column
              rowData[3] = item.quantity; // D column
              rowData[6] = updatedOrder.customerName; // G column
              rowData[9] = updatedOrder.discountAmount > 0 ? updatedOrder.discountAmount : ""; // J column
              rowData[10] = deliveryFee > 0 ? deliveryFee : ""; // K column
              return rowData;
            });

            // Fire and forget
            fetch(webhookUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(rows)
            }).catch(err => console.error("Webhook error:", err));

          } catch (webhookErr) {
            console.error('Failed to construct webhook payload:', webhookErr);
          }
        }
      }

      return updatedOrder;
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    if (!requireAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!currentOrder) {
        throw new Error('Order not found');
      }

      // Restore inventory if active order is deleted
      if (currentOrder.status !== 'CANCELLED') {
        for (const item of currentOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }
      }

      await tx.orderItem.deleteMany({
        where: { orderId: id }
      });

      await tx.order.delete({
        where: { id }
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
