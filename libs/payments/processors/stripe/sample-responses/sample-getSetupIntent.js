const sample = {
    id: "seti_1QTR9DD6SqU8owGYqa15rcX0",
    object: "setup_intent",
    application: null,
    automatic_payment_methods: {
        allow_redirects: "never",
        enabled: true,
    },
    cancellation_reason: null,
    client_secret: "seti_1QTR9DD6SqU8owGYqa15rcX0_secret_RM9SjA8bnXe8S6DF4DEFtI6tKArjCk9",
    created: 1733589987,
    customer: "cus_RM0eWmwlxkogKO",
    description: null,
    flow_directions: null,
    last_setup_error: null,
    latest_attempt: "setatt_1QTR9HD6SqU8owGYY8uEGosa",
    livemode: false,
    mandate: null,
    metadata: {
    },
    next_action: null,
    on_behalf_of: null,
    payment_method: {
        id: "pm_1QTR99D6SqU8owGYaNZzXvFG",
        object: "payment_method",
        allow_redisplay: "unspecified",
        billing_details: {
            address: {
                city: null,
                country: null,
                line1: null,
                line2: null,
                postal_code: null,
                state: null,
            },
            email: null,
            name: null,
            phone: null,
        },
        card: {
            brand: "visa",
            checks: {
                address_line1_check: null,
                address_postal_code_check: null,
                cvc_check: "pass",
            },
            country: "US",
            display_brand: "visa",
            exp_month: 3,
            exp_year: 2029,
            fingerprint: "ER4JXzEkwjffY8fr",
            funding: "credit",
            generated_from: null,
            last4: "4242",
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
        created: 1733589983,
        customer: "cus_RM0eWmwlxkogKO",
        livemode: false,
        metadata: {
        },
        radar_options: {
        },
        type: "card",
    },
    payment_method_configuration_details: {
        id: "pmc_1MjPO8D6SqU8owGY7P1fFomG",
        parent: null,
    },
    payment_method_options: {
        card: {
            mandate_options: null,
            network: null,
            request_three_d_secure: "automatic",
        },
    },
    payment_method_types: [
        "card",
        "link",
        "amazon_pay",
    ],
    single_use_mandate: null,
    status: "succeeded",
    usage: "off_session",
}