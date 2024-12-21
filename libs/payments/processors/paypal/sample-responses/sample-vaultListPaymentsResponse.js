const sample = {
    "customer": {
        "id": "BygeLlrpZF",
        "merchant_customer_id": "customer@merchant.com"
    },
    "payment_tokens": [
        {
            "id": "8kk8451t",
            "customer": {
                "id": "BygeLlrpZF"
            },
            "payment_source": {
                "card": {
                    "name": "John Doe",
                    "brand": "VISA",
                    "last_digits": "1111",
                    "expiry": "2027-02",
                    "billing_address": {
                        "id": "kk",
                        "address_line_1": "2211 N First Street",
                        "address_line_2": "17.3.160",
                        "admin_area_2": "San Jose",
                        "admin_area_1": "CA",
                        "postal_code": "95131",
                        "country_code": "US"
                    }
                }
            },
            "links": [
                {
                    "rel": "self",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens/8kk8451t",
                    "method": "GET",
                    "encType": "application/json"
                },
                {
                    "rel": "delete",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens/8kk8451t",
                    "method": "DELETE",
                    "encType": "application/json"
                }
            ]
        },
        {
            "id": "fgh6561t",
            "customer": {
                "id": "BygeLlrpZF"
            },
            "payment_source": {
                "paypal": {
                    "description": "Description for PayPal to be shown to PayPal payer",
                    "email_address": "john.doe@example.com",
                    "account_id": "VYYFH3WJ4JPJQ",
                    "shipping": {
                        "name": {
                            "full_name": "John Doe"
                        },
                        "address": {
                            "address_line_1": "2211 N First Street",
                            "address_line_2": "17.3.160",
                            "admin_area_2": "San Jose",
                            "admin_area_1": "CA",
                            "postal_code": "95131",
                            "country_code": "US"
                        }
                    },
                    "usage_pattern": "IMMEDIATE",
                    "usage_type": "MERCHANT",
                    "customer_type": "CONSUMER",
                    "name": {
                        "given_name": "John",
                        "surname": "Doe"
                    },
                    "address": {
                        "address_line_1": "2211 N First Street",
                        "address_line_2": "17.3.160",
                        "admin_area_2": "San Jose",
                        "admin_area_1": "CA",
                        "postal_code": "95131",
                        "country_code": "US"
                    }
                }
            },
            "links": [
                {
                    "rel": "self",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens/fgh6561t",
                    "method": "GET",
                    "encType": "application/json"
                },
                {
                    "rel": "delete",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens/fgh6561t",
                    "method": "DELETE",
                    "encType": "application/json"
                }
            ]
        },
        {
            "id": "hg654s1t",
            "customer": {
                "id": "BygeLlrpZF"
            },
            "payment_source": {
                "venmo": {
                    "description": "Description for Venmo to be shown to Venmo payer",
                    "shipping": {
                        "name": {
                            "full_name": "John Doe"
                        },
                        "address": {
                            "address_line_1": "2211 N First Street",
                            "address_line_2": "17.3.160",
                            "admin_area_2": "San Jose",
                            "admin_area_1": "CA",
                            "postal_code": "95131",
                            "country_code": "US"
                        }
                    },
                    "usage_pattern": "IMMEDIATE",
                    "usage_type": "MERCHANT",
                    "customer_type": "CONSUMER",
                    "email_address": "john.doe@example.com",
                    "user_name": "johndoe",
                    "name": {
                        "given_name": "John",
                        "surname": "Doe"
                    },
                    "account_id": "VYYFH3WJ4JPJQ",
                    "address": {
                        "address_line_1": "PayPal",
                        "address_line_2": "2211 North 1st Street",
                        "admin_area_1": "CA",
                        "admin_area_2": "San Jose",
                        "postal_code": "96112",
                        "country_code": "US"
                    }
                }
            },
            "links": [
                {
                    "rel": "self",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens/hg654s1t",
                    "method": "GET",
                    "encType": "application/json"
                },
                {
                    "rel": "delete",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens/hg654s1t",
                    "method": "DELETE",
                    "encType": "application/json"
                }
            ]
        },
        {
            "id": "8kk8457",
            "payment_source": {
                "apple_pay": {
                    "card": {
                        "name": "John Doe",
                        "last_digits": "1111",
                        "type": "CREDIT",
                        "brand": "VISA",
                        "billing_address": {
                            "address_line_1": "2211 N First Street",
                            "address_line_2": "17.3.160",
                            "admin_area_1": "CA",
                            "admin_area_2": "San Jose",
                            "postal_code": "95131",
                            "country_code": "US"
                        }
                    }
                }
            },
            "links": [
                {
                    "rel": "self",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens/8kk845",
                    "method": "GET"
                },
                {
                    "rel": "delete",
                    "href": "https://api-m.paypal.com/v3/vault/payment-tokens/8kk845",
                    "method": "DELETE"
                }
            ]
        }
    ],
    "links": [
        {
            "rel": "self",
            "href": "https://api-m.paypal.com/v3/vault/payment-tokens?customer_id=BygeLlrpZF&page=1&page_size=5&total_required=false",
            "method": "GET",
            "encType": "application/json"
        },
        {
            "rel": "first",
            "href": "https://api-m.paypal.com/v3/vault/payment-tokens?customer_id=BygeLlrpZF&page=1&page_size=5&total_required=false",
            "method": "GET",
            "encType": "application/json"
        },
        {
            "rel": "last",
            "href": "https://api-m.paypal.com/v3/vault/payment-tokens?customer_id=BygeLlrpZF&page=1&page_size=5&total_required=false",
            "method": "GET",
            "encType": "application/json"
        }
    ]
}