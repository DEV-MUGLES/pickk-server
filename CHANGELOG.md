# Pickk-Server Release Notes

## 0.0.52

✨New/Add

- Seller.orderNotiPhoneNumber,csNotiPhoneNumber 필드 추가
- SellerClaimPolicy.feePayMethod 필드 추가
- SellerClaimAccount 추가 (SellerClaimPolicy.account)
- SellerSettlePolicy 추가 (Seller.settlePolicy)
- updateMySellerSettlePolicy mutation 추가

🔧 Modified/Enhanced

- updateMySellerClaimPolicy input 스키마 변경 (accountInput 추가)
- createSellerInput.claimPolicyInput 스키마 변경 (accountInput 추가)
- createSellerInput 스키마 변경 (settlePolicyInput 추가)

🔥 Removed
none
