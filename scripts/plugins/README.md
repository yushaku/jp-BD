# VNPay WooCommerce plugin

Download the official VNPay WooCommerce plugin zip from the VNPay sandbox portal:

https://sandbox.vnpayment.vn/apis/docs/open/woocommerce/

Save the file as `vnpay-woocommerce.zip` in this directory, then re-run setup:

```bash
docker compose --profile cli run --rm --entrypoint bash wpcli /scripts/setup.sh
```

MoMo is installed automatically from WordPress.org (`payment-gateway-mo-mo-for-woocommerce`).
