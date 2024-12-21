const sample = {
    id: "68698180R7386984K",
    intent: "CAPTURE",
    status: "COMPLETED",
    payment_source: {
        card: {
            name: "CCREJECT-EC",
            last_digits: "1881",
            expiry: "2029-01",
            brand: "VISA",
            type: "UNKNOWN",
            bin_details: {
            },
        },
    },
    purchase_units: [
        {
            reference_id: "default",
            amount: {
                currency_code: "USD",
                value: "25.04",
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: "24.61",
                    },
                    shipping: {
                        currency_code: "USD",
                        value: "0.43",
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
            description: "Banda Bandeu Top - Mega Mendung (Sm)",
            soft_descriptor: "TEST STORE",
            items: [
                {
                    name: "Banda Bandeu Top - Mega Mendung (Sm)",
                    unit_amount: {
                        currency_code: "USD",
                        value: "24.61",
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
                        id: "3NY81826MW923484U",
                        status: "DECLINED",
                        amount: {
                            currency_code: "USD",
                            value: "25.04",
                        },
                        final_capture: true,
                        disbursement_mode: "INSTANT",
                        seller_protection: {
                            status: "NOT_ELIGIBLE",
                        },
                        seller_receivable_breakdown: {
                            gross_amount: {
                                currency_code: "USD",
                                value: "25.04",
                            },
                            paypal_fee: {
                                currency_code: "USD",
                                value: "1.51",
                            },
                            net_amount: {
                                currency_code: "USD",
                                value: "23.53",
                            },
                        },
                        links: [
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/captures/3NY81826MW923484U",
                                rel: "self",
                                method: "GET",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/checkout/orders/68698180R7386984K",
                                rel: "up",
                                method: "GET",
                            },
                        ],
                        create_time: "2024-12-21T08:49:47Z",
                        update_time: "2024-12-21T08:49:47Z",
                        network_transaction_reference: {
                            id: "000000000000000",
                            date: "0203",
                            network: "VISA",
                        },
                        processor_response: {
                            avs_code: "G",
                            cvv_code: "P",
                            response_code: "5400",
                        },
                    },
                ],
            },
        },
    ],
    create_time: "2024-12-21T08:49:47Z",
    update_time: "2024-12-21T08:49:47Z",
    links: [
        {
            href: "https://api.sandbox.paypal.com/v2/checkout/orders/68698180R7386984K",
            rel: "self",
            method: "GET",
        },
    ],
}