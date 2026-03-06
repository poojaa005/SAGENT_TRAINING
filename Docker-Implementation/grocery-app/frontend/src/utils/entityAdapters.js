const isPresent = (value) => value !== undefined && value !== null && value !== '';

export const pickFirst = (...values) => values.find(isPresent);

export const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];
  if (payload.value && typeof payload.value === 'object') return normalizeList(payload.value);
  if (payload.data && typeof payload.data === 'object' && !Array.isArray(payload.data)) return normalizeList(payload.data);
  if (Array.isArray(payload.content)) return payload.content;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.results)) return payload.results;
  if (Array.isArray(payload.cartItems)) return payload.cartItems;
  if (Array.isArray(payload.cartItemList)) return payload.cartItemList;
  if (Array.isArray(payload.cart_item_list)) return payload.cart_item_list;
  if (Array.isArray(payload.cartItemDTOList)) return payload.cartItemDTOList;
  if (Array.isArray(payload.orderItems)) return payload.orderItems;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.records)) return payload.records;
  if (isPresent(payload.id) || isPresent(payload.cartItemId) || isPresent(payload.productId) || isPresent(payload.orderId)) {
    return [payload];
  }
  return [];
};

export const getUserId = (user) =>
  pickFirst(user?.userId, user?.user_id, user?.id, user?.user?.userId, user?.user?.id);

export const getCartId = (cart) =>
  pickFirst(cart?.cartId, cart?.cart_id, cart?.id, cart?.value?.cartId, cart?.data?.cartId);

export const getCartItemId = (item) =>
  pickFirst(item?.cartItemId, item?.cart_item_id, item?.id);

export const getProductId = (product) =>
  pickFirst(
    product?.productId,
    product?.product_id,
    product?.id,
    product?.product?.productId,
    product?.product?.product_id,
    product?.product?.id
  );

export const getOrderId = (order) =>
  pickFirst(order?.orderId, order?.order_id, order?.id);

export const getProductName = (product) =>
  pickFirst(product?.productName, product?.product_name, product?.name, product?.product?.productName, product?.product?.name, 'Product');

export const getProductCategory = (product) =>
  pickFirst(product?.category, product?.product?.category, 'default');

export const getProductDescription = (product) =>
  pickFirst(product?.productDescription, product?.product_description, product?.description, product?.product?.productDescription, '');

export const getProductPrice = (product) =>
  toNumber(
    pickFirst(
      product?.price,
      product?.productPrice,
      product?.product_price,
      product?.unitPrice,
      product?.product?.price,
      product?.product?.productPrice,
      product?.product?.product_price
    )
  );

export const getProductOffer = (product) =>
  toNumber(pickFirst(product?.productOffer, product?.product_offer, product?.offer, product?.discountPercent, 0));

export const getStockQuantity = (product) =>
  toNumber(pickFirst(product?.stockQuantity, product?.stock_quantity, product?.stock, product?.availableQty, 0));

export const getItemQuantity = (item) =>
  toNumber(pickFirst(item?.quantity, item?.qty, item?.count, 0));

export const getUserName = (user) =>
  pickFirst(user?.name, user?.fullName, user?.username, 'User');

export const getUserRole = (user) =>
  pickFirst(user?.role, user?.userRole, 'USER');

export const getContactNumber = (user) =>
  pickFirst(user?.contactNumber, user?.phoneNo, user?.phone_no, user?.phone, user?.mobile, '');

export const getDeliveryAddress = (user) =>
  pickFirst(
    user?.deliveryAddress,
    user?.address,
    user?.addressLine,
    user?.address_line,
    user?.location,
    'Default Address'
  );

export const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: getUserId(user),
    name: getUserName(user),
    role: getUserRole(user),
    phoneNo: getContactNumber(user),
    address: getDeliveryAddress(user),
  };
};
