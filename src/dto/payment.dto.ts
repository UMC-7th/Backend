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

export const naverPaymentDTO = (body: any) => {
  return {
    productId: body.productId,
    amount: body.amount,
    buyerName: body.buyerName,
    buyerEmail: body.buyerEmail
  };
};