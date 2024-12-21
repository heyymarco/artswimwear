const sample = {
    id: "2V348991C6154690K",
    intent: "CAPTURE",
    status: "COMPLETED",
    payment_source: {
        card: {
            name: "Bambang",
            last_digits: "6650",
            expiry: "2025-01",
            brand: "MASTERCARD",
            available_networks: [
                "MASTERCARD",
            ],
            type: "CREDIT",
            attributes: {
                vault: {
                    id: "50660535fp389963a",
                    status: "VAULTED",
                    customer: {
                        id: "VIHhQdluoo",
                    },
                    links: [
                        {
                            href: "https://api.sandbox.paypal.com/v3/vault/payment-tokens/50660535fp389963a",
                            rel: "self",
                            method: "GET",
                        },
                        {
                            href: "https://api.sandbox.paypal.com/v3/vault/payment-tokens/50660535fp389963a",
                            rel: "delete",
                            method: "DELETE",
                        },
                        {
                            href: "https://api.sandbox.paypal.com/v2/checkout/orders/2V348991C6154690K",
                            rel: "up",
                            method: "GET",
                        },
                    ],
                },
            },
            bin_details: {
                bin: "53298797",
                issuing_bank: "COMPUTER SERVICES, INC.",
                bin_country_code: "US",
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
            description: "Bajo Halter Neck Top - Dayak Woven (Sm)",
            soft_descriptor: "TEST STORE",
            items: [
                {
                    name: "Bajo Halter Neck Top - Dayak Woven (Sm)",
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
                        id: "84A93538EF6742126",
                        status: "COMPLETED",
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
                                href: "https://api.sandbox.paypal.com/v2/payments/captures/84A93538EF6742126",
                                rel: "self",
                                method: "GET",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/captures/84A93538EF6742126/refund",
                                rel: "refund",
                                method: "POST",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/checkout/orders/2V348991C6154690K",
                                rel: "up",
                                method: "GET",
                            },
                        ],
                        create_time: "2024-12-21T10:11:03Z",
                        update_time: "2024-12-21T10:11:03Z",
                        network_transaction_reference: {
                            id: "VIS01106K",
                            date: "0123",
                            network: "MASTERCARD",
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
    create_time: "2024-12-21T10:11:03Z",
    update_time: "2024-12-21T10:11:03Z",
    links: [
        {
            href: "https://api.sandbox.paypal.com/v2/checkout/orders/2V348991C6154690K",
            rel: "self",
            method: "GET",
        },
    ],
}