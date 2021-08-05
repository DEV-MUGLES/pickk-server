import { Product } from '@item/products/models';
import { SellerShippingPolicy } from '@item/sellers/models';

type CalcShippingFeeInput = { product: Product; quantity: number };

class BrandInfo {
  private itemFinalPrices: number[] = [];

  constructor(public shippingPolicy: SellerShippingPolicy) {}

  add(itemFinalPrice: number) {
    this.itemFinalPrices.push(itemFinalPrice);
  }

  get totalItemFinalPrice(): number {
    return this.itemFinalPrices.reduce(
      (total, itemFinalPrice) => total + itemFinalPrice,
      0
    );
  }

  get requiredFee(): number {
    const { minimumAmountForFree, fee } = this.shippingPolicy;

    return this.totalItemFinalPrice < minimumAmountForFree ? fee : 0;
  }
}

export const calcTotalShippingFee = (
  inputs: CalcShippingFeeInput[]
): number => {
  const brandInfos = new Map<number, BrandInfo>();

  for (const { product, quantity } of inputs) {
    const { finalPrice, brand } = product.item;

    if (!brandInfos.has(brand.id)) {
      brandInfos.set(brand.id, new BrandInfo(brand.seller.shippingPolicy));
    }

    brandInfos.get(brand.id).add(finalPrice * quantity);
  }

  let totalShippingFee = 0;
  brandInfos.forEach((brandInfo) => {
    totalShippingFee += brandInfo.requiredFee;
  });

  return totalShippingFee;
};
