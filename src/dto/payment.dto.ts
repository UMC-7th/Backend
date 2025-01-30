export const kakaoPaymentDTO = (body: any) => {
    return {
      cid: body.cid,
      partner_order_id: body.orderId,
      partner_user_id: body.userId,
      item_name: body.itemName,
      quantity: body.quantity,
      total_amount: body.totalAmount,
    };
};