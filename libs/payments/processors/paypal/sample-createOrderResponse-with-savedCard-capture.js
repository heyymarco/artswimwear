const sample = {
    id: "5T710786T06567114",
    intent: "CAPTURE",
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
                value: "25.07",
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: "24.43",
                    },
                    shipping: {
                        currency_code: "USD",
                        value: "0.64",
                    },
                    handling: {
                        currency_code: "USD",
                        value: "0.00",
                    },
                    insurance: {
                        currency_code: "USD",
                        value: "0.00",
                    },
                    shipping_discount: {
                        currency_code: "USD",
                        value: "0.00",
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
            description: "Komodo V Cut Bottom  - Dayak Woven (Sm)",
            soft_descriptor: "TEST STORE",
            items: [
                {
                    name: "Komodo V Cut Bottom  - Dayak Woven (Sm)",
                    unit_amount: {
                        currency_code: "USD",
                        value: "24.43",
                    },
                    tax: {
                        currency_code: "USD",
                        value: "0.00",
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
            },
            payments: {
                captures: [
                    {
                        id: "0XX3309307732590Y",
                        status: "COMPLETED",
                        amount: {
                            currency_code: "USD",
                            value: "25.07",
                        },
                        final_capture: true,
                        disbursement_mode: "INSTANT",
                        seller_protection: {
                            status: "NOT_ELIGIBLE",
                        },
                        seller_receivable_breakdown: {
                            gross_amount: {
                                currency_code: "USD",
                                value: "25.07",
                            },
                            paypal_fee: {
                                currency_code: "USD",
                                value: "1.52",
                            },
                            net_amount: {
                                currency_code: "USD",
                                value: "23.55",
                            },
                        },
                        links: [
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/captures/0XX3309307732590Y",
                                rel: "self",
                                method: "GET",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/captures/0XX3309307732590Y/refund",
                                rel: "refund",
                                method: "POST",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/checkout/orders/5T710786T06567114",
                                rel: "up",
                                method: "GET",
                            },
                        ],
                        create_time: "2024-12-20T18:48:14Z",
                        update_time: "2024-12-20T18:48:14Z",
                        network_transaction_reference: {
                            id: "864109425517117",
                            date: "0408",
                            network: "DISCOVER",
                        },
                        processor_response: {
                            avs_code: "Y",
                            cvv_code: "M",
                            response_code: "0000",
                        },
                    },
                ],
            },
        },
    ],
    create_time: "2024-12-20T18:48:14Z",
    update_time: "2024-12-20T18:48:14Z",
    links: [
        {
            href: "https://api.sandbox.paypal.com/v2/checkout/orders/5T710786T06567114",
            rel: "self",
            method: "GET",
        },
    ],
}