const sample = {
    id: "8YY60073V53512231",
    intent: "AUTHORIZE",
    status: "COMPLETED",
    payment_source: {
        card: {
            name: "Budi",
            last_digits: "0004",
            expiry: "2029-01",
            brand: "DISCOVER",
            available_networks: [
                "DINERS",
            ],
            type: "CREDIT",
            bin_details: {
                bin: "36259",
                products: [
                    "COMMERCIAL",
                ],
            },
        },
    },
    purchase_units: [
        {
            reference_id: "default",
            amount: {
                currency_code: "USD",
                value: "24.86",
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: "24.43",
                    },
                    shipping: {
                        currency_code: "USD",
                        value: "0.43",
                    },
                },
            },
            payee: {
                email_address: "sb-ll80225278267@business.example.com",
                merchant_id: "MJRUQCVE8CVPN",
                display_data: {
                    brand_name: "ArtSwimwear.com",
                },
            },
            soft_descriptor: "TEST STORE",
            items: [
                {
                    name: "Bajo Halter Neck Top - Mega Mendung (Sm)",
                    unit_amount: {
                        currency_code: "USD",
                        value: "24.43",
                    },
                    quantity: "1",
                    category: "PHYSICAL_GOODS",
                },
            ],
            shipping: {
                name: {
                    full_name: "Yunus Kurniawan",
                },
                address: {
                    address_line_1: "Jl Monjali Gang Perkutut 25",
                    admin_area_2: "Sleman",
                    admin_area_1: "DI Yogyakarta",
                    postal_code: "55284",
                    country_code: "ID",
                },
                type: "SHIPPING",
            },
            payments: {
                authorizations: [
                    {
                        status: "CREATED",
                        id: "92X28747BW716125D",
                        amount: {
                            currency_code: "USD",
                            value: "24.86",
                        },
                        seller_protection: {
                            status: "NOT_ELIGIBLE",
                        },
                        processor_response: {
                            avs_code: "Y",
                            cvv_code: "M",
                            response_code: "0000",
                        },
                        expiration_time: "2025-01-18T18:10:42Z",
                        links: [
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D",
                                rel: "self",
                                method: "GET",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D/capture",
                                rel: "capture",
                                method: "POST",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/authorizations/92X28747BW716125D/void",
                                rel: "void",
                                method: "POST",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/checkout/orders/8YY60073V53512231",
                                rel: "up",
                                method: "GET",
                            },
                        ],
                        create_time: "2024-12-20T18:10:42Z",
                        update_time: "2024-12-20T18:10:42Z",
                        network_transaction_reference: {
                            id: "864109425517117",
                            date: "0408",
                            network: "DISCOVER",
                        },
                    },
                ],
            },
        },
    ],
    create_time: "2024-12-20T18:10:39Z",
    update_time: "2024-12-20T18:10:42Z",
    links: [
        {
            href: "https://api.sandbox.paypal.com/v2/checkout/orders/8YY60073V53512231",
            rel: "self",
            method: "GET",
        },
    ],
}