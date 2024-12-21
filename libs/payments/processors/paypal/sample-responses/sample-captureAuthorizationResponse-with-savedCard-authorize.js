const sample = {
    id: "1YE65299KT059304Y",
    amount: {
        currency_code: "USD",
        value: "24.86",
    },
    final_capture: true,
    seller_protection: {
        status: "NOT_ELIGIBLE",
    },
    disbursement_mode: "INSTANT",
    seller_receivable_breakdown: {
        gross_amount: {
            currency_code: "USD",
            value: "24.86",
        },
        paypal_fee: {
            currency_code: "USD",
            value: "1.51",
        },
        net_amount: {
            currency_code: "USD",
            value: "23.35",
        },
    },
    status: "COMPLETED",
    processor_response: {
        avs_code: "Y",
        cvv_code: "M",
        response_code: "0000",
    },
    payee: {
        email_address: "sb-ll80225278267@business.example.com",
        merchant_id: "MJRUQCVE8CVPN",
    },
    create_time: "2024-12-20T18:11:31Z",
    update_time: "2024-12-20T18:11:31Z",
    links: [
        {
            href: "https://api.sandbox.paypal.com/v2/payments/captures/1YE65299KT059304Y",
            rel: "self",
            method: "GET",
        },
        {
            href: "https://api.sandbox.paypal.com/v2/payments/captures/1YE65299KT059304Y/refund",
            rel: "refund",
            method: "POST",
        },
        {
            href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D",
            rel: "up",
            method: "GET",
        },
    ],
    network_transaction_reference: {
        id: "864109425517117",
        date: "0408",
        network: "DISCOVER",
    },
}