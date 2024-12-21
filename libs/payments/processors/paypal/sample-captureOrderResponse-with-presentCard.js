const sample = {
    id: "46H55548GU006254C",
    intent: "CAPTURE",
    status: "COMPLETED",
    payment_source: {
        card: {
            name: "Bambang Budiman",
            last_digits: "5047",
            expiry: "2025-01",
            brand: "MASTERCARD",
            available_networks: [
                "MASTERCARD",
            ],
            type: "DEBIT",
            attributes: {
                vault: {
                    id: "6ku98087c53665010",
                    status: "VAULTED",
                    customer: {
                        id: "VIHhQdluoo",
                    },
                    links: [
                        {
                            href: "https://api.sandbox.paypal.com/v3/vault/payment-tokens/6ku98087c53665010",
                            rel: "self",
                            method: "GET",
                        },
                        {
                            href: "https://api.sandbox.paypal.com/v3/vault/payment-tokens/6ku98087c53665010",
                            rel: "delete",
                            method: "DELETE",
                        },
                        {
                            href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C",
                            rel: "up",
                            method: "GET",
                        },
                    ],
                },
            },
            bin_details: {
                bin: "506351",
                issuing_bank: "NCUBO CAPITAL ",
                bin_country_code: "MX",
            },
        },
    },
    purchase_units: [
        {
            reference_id: "default",
            amount: {
                currency_code: "USD",
                value: "61.27",
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: "60.63",
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
            description: "Dewata Plunge Onepiece - Dayak Woven (Sm)",
            soft_descriptor: "TEST STORE",
            items: [
                {
                    name: "Dewata Plunge Onepiece - Dayak Woven (Sm)",
                    unit_amount: {
                        currency_code: "USD",
                        value: "60.63",
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
                        id: "5KV02158HD8066142",
                        status: "COMPLETED",
                        amount: {
                            currency_code: "USD",
                            value: "61.27",
                        },
                        final_capture: true,
                        disbursement_mode: "INSTANT",
                        seller_protection: {
                            status: "NOT_ELIGIBLE",
                        },
                        seller_receivable_breakdown: {
                            gross_amount: {
                                currency_code: "USD",
                                value: "61.27",
                            },
                            paypal_fee: {
                                currency_code: "USD",
                                value: "3.00",
                            },
                            net_amount: {
                                currency_code: "USD",
                                value: "58.27",
                            },
                        },
                        links: [
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/captures/5KV02158HD8066142",
                                rel: "self",
                                method: "GET",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/payments/captures/5KV02158HD8066142/refund",
                                rel: "refund",
                                method: "POST",
                            },
                            {
                                href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C",
                                rel: "up",
                                method: "GET",
                            },
                        ],
                        create_time: "2024-12-20T18:26:44Z",
                        update_time: "2024-12-20T18:26:44Z",
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
    create_time: "2024-12-20T18:26:44Z",
    update_time: "2024-12-20T18:26:44Z",
    links: [
        {
            href: "https://api.sandbox.paypal.com/v2/checkout/orders/46H55548GU006254C",
            rel: "self",
            method: "GET",
        },
    ],
}