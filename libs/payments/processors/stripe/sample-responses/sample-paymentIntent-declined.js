const sample = {
    type: "StripeCardError",
    raw: {
        charge: "ch_3PgQFND6SqU8owGY18nat0La",
        code: "card_declined",
        decline_code: "generic_decline",
        doc_url: "https://stripe.com/docs/error-codes/card-declined",
        message: "Your card was declined.",
        payment_intent: {
            id: "pi_3PgQFND6SqU8owGY1BaO8DHR",
            object: "payment_intent",
            amount: 2506,
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
            client_secret: "pi_3PgQFND6SqU8owGY1BaO8DHR_secret_xL95GHzgmHvoncXBAsxSA2lNL",
            confirmation_method: "automatic",
            created: 1721908453,
            currency: "usd",
            customer: null,
            description: null,
            invoice: null,
            last_payment_error: {
                charge: "ch_3PgQFND6SqU8owGY18nat0La",
                code: "card_declined",
                decline_code: "generic_decline",
                doc_url: "https://stripe.com/docs/error-codes/card-declined",
                message: "Your card was declined.",
                payment_method: {
                    id: "pm_1PgQFCD6SqU8owGYxRycg2sp",
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
                        exp_month: 12,
                        exp_year: 2034,
                        fingerprint: "2vIPq9JPFdYz8JZO",
                        funding: "credit",
                        generated_from: null,
                        last4: "0002",
                        networks: {
                            available: [
                                "visa",
                            ],
                            preferred: null,
                        },
                        three_d_secure_usage: {
                            supported: true,
                        },
                        wallet: null,
                    },
                    created: 1721908442,
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
            latest_charge: "ch_3PgQFND6SqU8owGY18nat0La",
            livemode: false,
            metadata: {
            },
            next_action: null,
            on_behalf_of: null,
            payment_method: null,
            payment_method_configuration_details: {
                id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
                parent: null,
            },
            payment_method_options: {
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
            ],
            processing: null,
            receipt_email: null,
            review: null,
            setup_future_usage: null,
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
            id: "pm_1PgQFCD6SqU8owGYxRycg2sp",
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
                exp_month: 12,
                exp_year: 2034,
                fingerprint: "2vIPq9JPFdYz8JZO",
                funding: "credit",
                generated_from: null,
                last4: "0002",
                networks: {
                    available: [
                        "visa",
                    ],
                    preferred: null,
                },
                three_d_secure_usage: {
                    supported: true,
                },
                wallet: null,
            },
            created: 1721908442,
            customer: null,
            livemode: false,
            metadata: {
            },
            radar_options: {
            },
            type: "card",
        },
        request_log_url: "https://dashboard.stripe.com/test/logs/req_DoE9rERpVndavX?t=1721908453",
        type: "card_error",
        headers: {
            server: "nginx",
            date: "Thu, 25 Jul 2024 11:54:14 GMT",
            "content-type": "application/json",
            "content-length": "5664",
            connection: "keep-alive",
            "access-control-allow-credentials": "true",
            "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "access-control-allow-origin": "*",
            "access-control-expose-headers": "Request-Id, Stripe-Manage-Version, Stripe-Should-Retry, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
            "access-control-max-age": "300",
            "cache-control": "no-cache, no-store",
            "content-security-policy": "report-uri https://q.stripe.com/csp-report?p=v1%2Fpayment_intents; block-all-mixed-content; default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self'; script-src 'self' 'report-sample'; style-src 'self'",
            "cross-origin-opener-policy-report-only": "same-origin; report-to=\"coop\"",
            "idempotency-key": "stripe-node-retry-4e0f0a1d-d2c9-4f05-b8b2-1a248810b8af",
            "original-request": "req_DoE9rERpVndavX",
            "report-to": "{\"group\":\"coop\",\"max_age\":8640,\"endpoints\":[{\"url\":\"https://q.stripe.com/coop-report?s=payins-bapi-srv\"}],\"include_subdomains\":true}",
            "reporting-endpoints": "coop=\"https://q.stripe.com/coop-report?s=payins-bapi-srv\"",
            "request-id": "req_DoE9rERpVndavX",
            "stripe-should-retry": "false",
            "stripe-version": "2024-06-20",
            vary: "Origin",
            "x-content-type-options": "nosniff",
            "x-stripe-priority-routing-enabled": "true",
            "x-stripe-routing-context-priority-tier": "api-testmode",
            "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
        },
        statusCode: 402,
        requestId: "req_DoE9rERpVndavX",
    },
    rawType: "card_error",
    code: "card_declined",
    doc_url: "https://stripe.com/docs/error-codes/card-declined",
    param: undefined,
    detail: undefined,
    headers: {
        server: "nginx",
        date: "Thu, 25 Jul 2024 11:54:14 GMT",
        "content-type": "application/json",
        "content-length": "5664",
        connection: "keep-alive",
        "access-control-allow-credentials": "true",
        "access-control-allow-methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
        "access-control-allow-origin": "*",
        "access-control-expose-headers": "Request-Id, Stripe-Manage-Version, Stripe-Should-Retry, X-Stripe-External-Auth-Required, X-Stripe-Privileged-Session-Required",
        "access-control-max-age": "300",
        "cache-control": "no-cache, no-store",
        "content-security-policy": "report-uri https://q.stripe.com/csp-report?p=v1%2Fpayment_intents; block-all-mixed-content; default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; img-src 'self'; script-src 'self' 'report-sample'; style-src 'self'",
        "cross-origin-opener-policy-report-only": "same-origin; report-to=\"coop\"",
        "idempotency-key": "stripe-node-retry-4e0f0a1d-d2c9-4f05-b8b2-1a248810b8af",
        "original-request": "req_DoE9rERpVndavX",
        "report-to": "{\"group\":\"coop\",\"max_age\":8640,\"endpoints\":[{\"url\":\"https://q.stripe.com/coop-report?s=payins-bapi-srv\"}],\"include_subdomains\":true}",
        "reporting-endpoints": "coop=\"https://q.stripe.com/coop-report?s=payins-bapi-srv\"",
        "request-id": "req_DoE9rERpVndavX",
        "stripe-should-retry": "false",
        "stripe-version": "2024-06-20",
        vary: "Origin",
        "x-content-type-options": "nosniff",
        "x-stripe-priority-routing-enabled": "true",
        "x-stripe-routing-context-priority-tier": "api-testmode",
        "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
    },
    requestId: "req_DoE9rERpVndavX",
    statusCode: 402,
    charge: "ch_3PgQFND6SqU8owGY18nat0La",
    decline_code: "generic_decline",
    payment_intent: {
        id: "pi_3PgQFND6SqU8owGY1BaO8DHR",
        object: "payment_intent",
        amount: 2506,
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
        client_secret: "pi_3PgQFND6SqU8owGY1BaO8DHR_secret_xL95GHzgmHvoncXBAsxSA2lNL",
        confirmation_method: "automatic",
        created: 1721908453,
        currency: "usd",
        customer: null,
        description: null,
        invoice: null,
        last_payment_error: {
            charge: "ch_3PgQFND6SqU8owGY18nat0La",
            code: "card_declined",
            decline_code: "generic_decline",
            doc_url: "https://stripe.com/docs/error-codes/card-declined",
            message: "Your card was declined.",
            payment_method: {
                id: "pm_1PgQFCD6SqU8owGYxRycg2sp",
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
                    exp_month: 12,
                    exp_year: 2034,
                    fingerprint: "2vIPq9JPFdYz8JZO",
                    funding: "credit",
                    generated_from: null,
                    last4: "0002",
                    networks: {
                        available: [
                            "visa",
                        ],
                        preferred: null,
                    },
                    three_d_secure_usage: {
                        supported: true,
                    },
                    wallet: null,
                },
                created: 1721908442,
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
        latest_charge: "ch_3PgQFND6SqU8owGY18nat0La",
        livemode: false,
        metadata: {
        },
        next_action: null,
        on_behalf_of: null,
        payment_method: null,
        payment_method_configuration_details: {
            id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
            parent: null,
        },
        payment_method_options: {
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
        ],
        processing: null,
        receipt_email: null,
        review: null,
        setup_future_usage: null,
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
        id: "pm_1PgQFCD6SqU8owGYxRycg2sp",
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
            exp_month: 12,
            exp_year: 2034,
            fingerprint: "2vIPq9JPFdYz8JZO",
            funding: "credit",
            generated_from: null,
            last4: "0002",
            networks: {
                available: [
                    "visa",
                ],
                preferred: null,
            },
            three_d_secure_usage: {
                supported: true,
            },
            wallet: null,
        },
        created: 1721908442,
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