import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function useContactCounts(isAdmin: boolean) {
  const [unreadContactMessagesCount, setUnreadContactMessagesCount] = useState<number>(0);

  const refreshUnreadContactMessages = useCallback(async () => {
    if (!isAdmin) {
      setUnreadContactMessagesCount(0);
      return;
    }
    try {
      const { count, error } = await supabase
        .from('consultation_requests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'new');

      if (error) {
        console.warn('Unread consultation requests count failed:', error.message);
        return;
      }
      setUnreadContactMessagesCount(count ?? 0);
    } catch (err) {
      console.warn('Unread consultation requests count threw:', err);
    }
  }, [isAdmin]);

  useEffect(() => {
    void refreshUnreadContactMessages();
  }, [refreshUnreadContactMessages]);

  return { unreadContactMessagesCount, refreshUnreadContactMessages };
}