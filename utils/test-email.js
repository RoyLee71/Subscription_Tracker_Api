import { sendReminderEmail } from './send-email.js';

const testSubscription = {
    name: "Coursera Prop",
    price: 140.00,
    currency: "USD",
    frequency: "monthly",
    category: "entertainment",
    startDate: "2025-01-15",
    paymentMethod: "credit_card"

};

(async () => {
  try {
    await sendReminderEmail({
      to: testSubscription.user.email,
      type: '7 days before reminder', // a valid label from emailTemplates
      subscription: testSubscription,
    });
    console.log('Test email sent!');
  } catch (error) {
    console.error('Test email failed:', error);
  }
})();