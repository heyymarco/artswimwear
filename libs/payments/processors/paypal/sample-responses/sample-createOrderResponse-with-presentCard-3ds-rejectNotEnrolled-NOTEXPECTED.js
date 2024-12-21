const sample = {
    id: "1CG035169X396191S",
    intent: "CAPTURE",
    status: "CREATED",
    payment_source: {
        card: {
            billing_address: {
                address_line_1: "Jl Monjali Gang Perkutut 25",
                admin_area_2: "Sleman",
                admin_area_1: "DI Yogyakarta",
                postal_code: "55284",
                country_code: "ID",
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
                },
            },
            payee: {
                email_address: "sb-ll80225278267@business.example.com",
                merchant_id: "MJRUQCVE8CVPN",
                display_data: {
                    brand_name: "ArtSwimwear.com",
                },
            },
            items: [
                {
                    name: "Bajo Halter Neck Top - Dayak Woven (Sm)",
                    unit_amount: {
                        currency_code: "USD",
                        value: "24.61",
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
        },
    ],
    create_time: "2024-12-21T10:28:55Z",
    links: [
        {
            href: "https://api.sandbox.paypal.com/v2/checkout/orders/1CG035169X396191S",
            rel: "self",
            method: "GET",
        },
        {
            href: "https://www.sandbox.paypal.com/checkoutnow?token=1CG035169X396191S",
            rel: "approve",
            method: "GET",
        },
        {
            href: "https://api.sandbox.paypal.com/v2/checkout/orders/1CG035169X396191S",
            rel: "update",
            method: "PATCH",
        },
        {
            href: "https://api.sandbox.paypal.com/v2/checkout/orders/1CG035169X396191S/capture",
            rel: "capture",
            method: "POST",
        },
    ],
}