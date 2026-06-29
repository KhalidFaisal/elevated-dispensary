'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/components/CartProvider';

export default function SessionTracker() {
  const pathname = usePathname();
  const { total, items } = useCart();

  useEffect(() => {
    // Generate or get session token
    let sessionToken = localStorage.getItem('holybuds_session_token');
    if (!sessionToken) {
      sessionToken = crypto.randomUUID();
      localStorage.setItem('holybuds_session_token', sessionToken);
    }

    const pingPresence = async () => {
      try {
        // Read checkout draft
        const checkoutDraftStr = localStorage.getItem('holybuds_checkout_draft');
        let checkoutDraft = null;
        if (checkoutDraftStr) {
          try { checkoutDraft = JSON.parse(checkoutDraftStr); } catch(e) {}
        }

        // Try to identify from recent orders
        let knownIdentity = null;
        if (!checkoutDraft?.customerName) {
          const recentOrdersStr = localStorage.getItem('holybuds_recent_orders');
          if (recentOrdersStr) {
            try {
              const recentOrders = JSON.parse(recentOrdersStr);
              if (recentOrders.length > 0) {
                const last = recentOrders[0];
                knownIdentity = {
                  customerName: last.customerName + ' (Returning)',
                  customerPhone: last.customerPhone,
                  deliveryAddress: last.deliveryAddress || ''
                };
              }
            } catch(e) {}
          }
        }

        // Prepare payload
        const payload = {
          sessionToken,
          cartTotal: total,
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
          currentPath: pathname,
          checkoutName: checkoutDraft?.customerName || knownIdentity?.customerName || '',
          checkoutPhone: checkoutDraft?.customerPhone || knownIdentity?.customerPhone || '',
          checkoutAddress: (checkoutDraft?.deliveryAddress && checkoutDraft?.deliveryMethod === 'DELIVERY') 
            ? `${checkoutDraft.deliveryAddress}, ${checkoutDraft.town || ''} ${checkoutDraft.zipCode || ''}`.trim()
            : knownIdentity?.deliveryAddress || ''
        };

        await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        // Silently fail if tracking errors out
      }
    };

    // Ping immediately on mount/change
    pingPresence();

    // Ping every 15 seconds
    const interval = setInterval(pingPresence, 15000);
    
    return () => clearInterval(interval);
  }, [pathname, total, items]);

  return null;
}
