const sample = {
    type: "StripeCardError",
    raw: {
        advice_code: "try_again_later",
        charge: "ch_3QZ7KYD6SqU8owGY1eB1KaJD",
        code: "card_declined",
        decline_code: "card_velocity_exceeded",
        doc_url: "https://stripe.com/docs/error-codes/card-declined",
        message: "Your card was declined for making repeated attempts too frequently or exceeding its amount limit.",
        payment_intent: {
            id: "pi_3QZ7KYD6SqU8owGY182df8cZ",
            object: "payment_intent",
            amount: 2505,
            amount_capturable: 0,
            amount_details: {
                tip: {
                },
            },
            amount_received: 0,
            application: null,
            application_fee_amount: null,
            automatic_payment_methods: {
                allow_redirects: "never",
                enabled: true,
            },
            canceled_at: null,
            cancellation_reason: null,
            capture_method: "manual",
            client_secret: "pi_3QZ7KYD6SqU8owGY182df8cZ_secret_kHEIgcjTHruJnyh4n1ypStFxj",
            confirmation_method: "automatic",
            created: 1734943778,
            currency: "usd",
            customer: "cus_RM0eWmwlxkogKO",
            description: null,
            invoice: null,
            last_payment_error: {
                advice_code: "try_again_later",
                charge: "ch_3QZ7KYD6SqU8owGY1eB1KaJD",
                code: "card_declined",
                decline_code: "card_velocity_exceeded",
                doc_url: "https://stripe.com/docs/error-codes/card-declined",
                message: "Your card was declined for making repeated attempts too frequently or exceeding its amount limit.",
                payment_method: {
                    id: "pm_1QZ7KWD6SqU8owGYtu1SJUVq",
                    object: "payment_method",
                    allow_redisplay: "unspecified",
                    billing_details: {
                        address: {
                            city: "Sleman",
                            country: "ID",
                            line1: "Jl Monjali Gang Perkutut 25",
                            line2: null,
                            postal_code: "55284",
                            state: "DI Yogyakarta",
                        },
                        email: null,
                        name: "Yunus Kurniawan",
                        phone: "0838467735677",
                    },
                    card: {
                        brand: "visa",
                        checks: {
                            address_line1_check: "pass",
                            address_postal_code_check: "pass",
                            cvc_check: "pass",
                        },
                        country: "US",
                        display_brand: "visa",
                        exp_month: 1,
                        exp_year: 2029,
                        fingerprint: "BN97RHEFkuK5Cqzs",
                        funding: "credit",
                        generated_from: null,
                        last4: "6975",
                        networks: {
                            available: [
                                "visa",
                            ],
                            preferred: null,
                        },
                        regulated_status: "unregulated",
                        three_d_secure_usage: {
                            supported: true,
                        },
                        wallet: null,
                    },
                    created: 1734943777,
                    customer: null,
                    livemode: false,
                    metadata: {
                    },
                    radar_options: {
                    },
                    type: "card",
                },
                type: "card_error",
            },
            latest_charge: "ch_3QZ7KYD6SqU8owGY1eB1KaJD",
            livemode: false,
            metadata: {
                orderId: "1833211529253160",
            },
            next_action: null,
            on_behalf_of: null,
            payment_method: null,
            payment_method_configuration_details: {
                id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
                parent: null,
            },
            payment_method_options: {
                amazon_pay: {
                    express_checkout_element_session_id: null,
                },
                card: {
                    installments: null,
                    mandate_options: null,
                    network: null,
                    request_three_d_secure: "automatic",
                },
                link: {
                    persistent_token: null,
                },
            },
            payment_method_types: [
                "card",
                "link",
                "amazon_pay",
            ],
            processing: null,
            receipt_email: null,
            review: null,
            setup_future_usage: "off_session",
            shipping: {
                address: {
                    city: "Sleman",
                    country: "ID",
                    line1: "Jl Monjali Gang Perkutut 25",
                    line2: null,
                    postal_code: "55284",
                    state: "DI Yogyakarta",
                },
                carrier: null,
                name: "Yunus Kurniawan",
                phone: "0838467735677",
                tracking_number: null,
            },
            source: null,
            statement_descriptor: null,
            statement_descriptor_suffix: null,
            status: "requires_payment_method",
            transfer_data: null,
            transfer_group: null,
        },
        payment_method: {
            id: "pm_1QZ7KWD6SqU8owGYtu1SJUVq",
            object: "payment_method",
            allow_redisplay: "unspecified",
            billing_details: {
                address: {
                    city: "Sleman",
                    country: "ID",
                    line1: "Jl Monjali Gang Perkutut 25",
                    line2: null,
                    postal_code: "55284",
                    state: "DI Yogyakarta",
                },
                email: null,
                name: "Yunus Kurniawan",
                phone: "0838467735677",
            },
            card: {
                brand: "visa",
                checks: {
                    address_line1_check: "pass",
                    address_postal_code_check: "pass",
                    cvc_check: "pass",
                },
                country: "US",
                display_brand: "visa",
                exp_month: 1,
                exp_year: 2029,
                fingerprint: "BN97RHEFkuK5Cqzs",
                funding: "credit",
                generated_from: null,
                last4: "6975",
                networks: {
                    available: [
                        "visa",
                    ],
                    preferred: null,
                },
                regulated_status: "unregulated",
                three_d_secure_usage: {
                    supported: true,
                },
                wallet: null,
            },
            created: 1734943777,
            customer: null,
            livemode: false,
            metadata: {
            },
            radar_options: {
            },
            type: "card",
        },
        request_log_url: "https://dashboard.stripe.com/test/logs/req_VhXWUS24ys7qLV?t=1734943778",
        type: "card_error",
        headers: {
            server: "nginx",
            date: "Mon, 23 Dec 2024 08:49:39 GMT",
            "content-type": "application/json",
            "content-length": "6168",
            connection: "keep-alive",
            "access-control-allow-credentials": "true",
            "access-control-allow-methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
            "access-control-allow-origin": "*",
            "access-control-expose-headers": "Request-Id, Stripe-Manage-Version, Stripe-Should-Retry, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
            "access-control-max-age": "300",
            "cache-control": "no-cache, no-store",
            "content-security-policy": "base-uri 'none'; default-src 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self'; script-src 'self' 'report-sample'; style-src 'self'; upgrade-insecure-requests; report-uri /csp-violation https://q.stripe.com/csp-violation?q=5wnKsZ9FEisdhvTXXVDv4-MToaJkkMXug7Fl0J0xuqcimYb5bc-i_jhXH5tZ2P1sqh0fYRFGiQ%3D%3D",
            "cross-origin-opener-policy-report-only": "same-origin; report-to=\"coop\"",
            "idempotency-key": "stripe-node-retry-95a2846d-334b-4e02-9977-eb651a989269",
            "original-request": "req_VhXWUS24ys7qLV",
            "report-to": "{\"group\":\"coop\",\"max_age\":8640,\"endpoints\":[{\"url\":\"https://q.stripe.com/coop-report\"}],\"include_subdomains\":true}",
            "reporting-endpoints": "coop=\"https://q.stripe.com/coop-report\"",
            "request-id": "req_VhXWUS24ys7qLV",
            "stripe-should-retry": "false",
            "stripe-version": "2024-06-20",
            vary: "Origin",
            "x-content-type-options": "nosniff",
            "x-stripe-priority-routing-enabled": "true",
            "x-stripe-routing-context-priority-tier": "api-testmode",
            "x-wc": "AB",
            "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
        },
        statusCode: 402,
        requestId: "req_VhXWUS24ys7qLV",
    },
    rawType: "card_error",
    code: "card_declined",
    doc_url: "https://stripe.com/docs/error-codes/card-declined",
    param: undefined,
    detail: undefined,
    headers: {
        server: "nginx",
        date: "Mon, 23 Dec 2024 08:49:39 GMT",
        "content-type": "application/json",
        "content-length": "6168",
        connection: "keep-alive",
        "access-control-allow-credentials": "true",
        "access-control-allow-methods": "GET, HEAD, PUT, PATCH, POST, DELETE",
        "access-control-allow-origin": "*",
        "access-control-expose-headers": "Request-Id, Stripe-Manage-Version, Stripe-Should-Retry, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
        "access-control-max-age": "300",
        "cache-control": "no-cache, no-store",
        "content-security-policy": "base-uri 'none'; default-src 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self'; script-src 'self' 'report-sample'; style-src 'self'; upgrade-insecure-requests; report-uri /csp-violation https://q.stripe.com/csp-violation?q=5wnKsZ9FEisdhvTXXVDv4-MToaJkkMXug7Fl0J0xuqcimYb5bc-i_jhXH5tZ2P1sqh0fYRFGiQ%3D%3D",
        "cross-origin-opener-policy-report-only": "same-origin; report-to=\"coop\"",
        "idempotency-key": "stripe-node-retry-95a2846d-334b-4e02-9977-eb651a989269",
        "original-request": "req_VhXWUS24ys7qLV",
        "report-to": "{\"group\":\"coop\",\"max_age\":8640,\"endpoints\":[{\"url\":\"https://q.stripe.com/coop-report\"}],\"include_subdomains\":true}",
        "reporting-endpoints": "coop=\"https://q.stripe.com/coop-report\"",
        "request-id": "req_VhXWUS24ys7qLV",
        "stripe-should-retry": "false",
        "stripe-version": "2024-06-20",
        vary: "Origin",
        "x-content-type-options": "nosniff",
        "x-stripe-priority-routing-enabled": "true",
        "x-stripe-routing-context-priority-tier": "api-testmode",
        "x-wc": "AB",
        "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
    },
    requestId: "req_VhXWUS24ys7qLV",
    statusCode: 402,
    charge: "ch_3QZ7KYD6SqU8owGY1eB1KaJD",
    decline_code: "card_velocity_exceeded",
    payment_intent: {
        id: "pi_3QZ7KYD6SqU8owGY182df8cZ",
        object: "payment_intent",
        amount: 2505,
        amount_capturable: 0,
        amount_details: {
            tip: {
            },
        },
        amount_received: 0,
        application: null,
        application_fee_amount: null,
        automatic_payment_methods: {
            allow_redirects: "never",
            enabled: true,
        },
        canceled_at: null,
        cancellation_reason: null,
        capture_method: "manual",
        client_secret: "pi_3QZ7KYD6SqU8owGY182df8cZ_secret_kHEIgcjTHruJnyh4n1ypStFxj",
        confirmation_method: "automatic",
        created: 1734943778,
        currency: "usd",
        customer: "cus_RM0eWmwlxkogKO",
        description: null,
        invoice: null,
        last_payment_error: {
            advice_code: "try_again_later",
            charge: "ch_3QZ7KYD6SqU8owGY1eB1KaJD",
            code: "card_declined",
            decline_code: "card_velocity_exceeded",
            doc_url: "https://stripe.com/docs/error-codes/card-declined",
            message: "Your card was declined for making repeated attempts too frequently or exceeding its amount limit.",
            payment_method: {
                id: "pm_1QZ7KWD6SqU8owGYtu1SJUVq",
                object: "payment_method",
                allow_redisplay: "unspecified",
                billing_details: {
                    address: {
                        city: "Sleman",
                        country: "ID",
                        line1: "Jl Monjali Gang Perkutut 25",
                        line2: null,
                        postal_code: "55284",
                        state: "DI Yogyakarta",
                    },
                    email: null,
                    name: "Yunus Kurniawan",
                    phone: "0838467735677",
                },
                card: {
                    brand: "visa",
                    checks: {
                        address_line1_check: "pass",
                        address_postal_code_check: "pass",
                        cvc_check: "pass",
                    },
                    country: "US",
                    display_brand: "visa",
                    exp_month: 1,
                    exp_year: 2029,
                    fingerprint: "BN97RHEFkuK5Cqzs",
                    funding: "credit",
                    generated_from: null,
                    last4: "6975",
                    networks: {
                        available: [
                            "visa",
                        ],
                        preferred: null,
                    },
                    regulated_status: "unregulated",
                    three_d_secure_usage: {
                        supported: true,
                    },
                    wallet: null,
                },
                created: 1734943777,
                customer: null,
                livemode: false,
                metadata: {
                },
                radar_options: {
                },
                type: "card",
            },
            type: "card_error",
        },
        latest_charge: "ch_3QZ7KYD6SqU8owGY1eB1KaJD",
        livemode: false,
        metadata: {
            orderId: "1833211529253160",
        },
        next_action: null,
        on_behalf_of: null,
        payment_method: null,
        payment_method_configuration_details: {
            id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
            parent: null,
        },
        payment_method_options: {
            amazon_pay: {
                express_checkout_element_session_id: null,
            },
            card: {
                installments: null,
                mandate_options: null,
                network: null,
                request_three_d_secure: "automatic",
            },
            link: {
                persistent_token: null,
            },
        },
        payment_method_types: [
            "card",
            "link",
            "amazon_pay",
        ],
        processing: null,
        receipt_email: null,
        review: null,
        setup_future_usage: "off_session",
        shipping: {
            address: {
                city: "Sleman",
                country: "ID",
                line1: "Jl Monjali Gang Perkutut 25",
                line2: null,
                postal_code: "55284",
                state: "DI Yogyakarta",
            },
            carrier: null,
            name: "Yunus Kurniawan",
            phone: "0838467735677",
            tracking_number: null,
        },
        source: null,
        statement_descriptor: null,
        statement_descriptor_suffix: null,
        status: "requires_payment_method",
        transfer_data: null,
        transfer_group: null,
    },
    payment_method: {
        id: "pm_1QZ7KWD6SqU8owGYtu1SJUVq",
        object: "payment_method",
        allow_redisplay: "unspecified",
        billing_details: {
            address: {
                city: "Sleman",
                country: "ID",
                line1: "Jl Monjali Gang Perkutut 25",
                line2: null,
                postal_code: "55284",
                state: "DI Yogyakarta",
            },
            email: null,
            name: "Yunus Kurniawan",
            phone: "0838467735677",
        },
        card: {
            brand: "visa",
            checks: {
                address_line1_check: "pass",
                address_postal_code_check: "pass",
                cvc_check: "pass",
            },
            country: "US",
            display_brand: "visa",
            exp_month: 1,
            exp_year: 2029,
            fingerprint: "BN97RHEFkuK5Cqzs",
            funding: "credit",
            generated_from: null,
            last4: "6975",
            networks: {
                available: [
                    "visa",
                ],
                preferred: null,
            },
            regulated_status: "unregulated",
            three_d_secure_usage: {
                supported: true,
            },
            wallet: null,
        },
        created: 1734943777,
        customer: null,
        livemode: false,
        metadata: {
        },
        radar_options: {
        },
        type: "card",
    },
    payment_method_type: undefined,
    setup_intent: undefined,
    source: undefined,
}