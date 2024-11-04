// zod:
import {
    z,
}                           from 'zod'

// models:
import {
    type Prisma,
}                           from '@prisma/client'
import {
    type Model,
    
    type MutationArgs,
    type PaginationArgs,
    
    type Literal,
    type Json,
}                           from './types'



// schemas:
export const CountrySchema = z.enum([
    'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BA', 'BW', 'BR', 'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'AN', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN', 'PL', 'PT', 'PR', 'QA', 'RO', 'RU', 'RW', 'RE', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SK', 'SI', 'SB', 'SO', 'ZA', 'SS', 'GS', 'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK', 'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VE', 'VN', 'VG', 'VI', 'WF', 'YE', 'ZM', 'ZW',
]);



export const CurrencySchema = z.enum([
    'AED', 'AFN', 'ALL', 'AMD', 'ANG', 'AOA', 'ARS', 'AUD', 'AWG', 'AZN', 'BAM', 'BBD', 'BDT', 'BGN', 'BHD', 'BIF', 'BMD', 'BND', 'BOB', 'BOV', 'BRL', 'BSD', 'BTN', 'BWP', 'BYN', 'BZD', 'CAD', 'CDF', 'CHE', 'CHF', 'CHW', 'CLF', 'CLP', 'CNY', 'COP', 'COU', 'CRC', 'CUP', 'CVE', 'CZK', 'DJF', 'DKK', 'DOP', 'DZD', 'EGP', 'ERN', 'ETB', 'EUR', 'FJD', 'FKP', 'GBP', 'GEL', 'GHS', 'GIP', 'GMD', 'GNF', 'GTQ', 'GYD', 'HKD', 'HNL', 'HTG', 'HUF', 'IDR', 'ILS', 'INR', 'IQD', 'IRR', 'ISK', 'JMD', 'JOD', 'JPY', 'KES', 'KGS', 'KHR', 'KMF', 'KPW', 'KRW', 'KWD', 'KYD', 'KZT', 'LAK', 'LBP', 'LKR', 'LRD', 'LSL', 'LYD', 'MAD', 'MDL', 'MGA', 'MKD', 'MMK', 'MNT', 'MOP', 'MRU', 'MUR', 'MVR', 'MWK', 'MXN', 'MXV', 'MYR', 'MZN', 'NAD', 'NGN', 'NIO', 'NOK', 'NPR', 'NZD', 'OMR', 'PAB', 'PEN', 'PGK', 'PHP', 'PKR', 'PLN', 'PYG', 'QAR', 'RON', 'RSD', 'RUB', 'RWF', 'SAR', 'SBD', 'SCR', 'SDG', 'SEK', 'SGD', 'SHP', 'SLE', 'SOS', 'SRD', 'SSP', 'STN', 'SVC', 'SYP', 'SZL', 'THB', 'TJS', 'TMT', 'TND', 'TOP', 'TRY', 'TTD', 'TWD', 'TZS', 'UAH', 'UGX', 'USD', 'USN', 'UYI', 'UYU', 'UYW', 'UZS', 'VED', 'VES', 'VND', 'VUV', 'WST', 'XAF', 'XAG', 'XAU', 'XBA', 'XBB', 'XBC', 'XBD', 'XCD', 'XDR', 'XOF', 'XPD', 'XPF', 'XPT', 'XSU', 'XTS', 'XUA', 'XXX', 'YER', 'ZAR', 'ZMW', 'ZWG', 'ZWL',
]);



export const EmptyStringSchema               = z.string().max(0);
export const ModelIdSchema                   = z.string().min(1);
export const ModelNameSchema                 = z.string().trim().min(1).max(50);
export const HumanFullNameSchema             = z.string().trim().min(2).max(30);
export const EmailSchema                     = z.string().email().trim().min(5).max(50);
export const UsernameSchema                  = z.string().trim().min(3).max(20);
export const PasswordSchema                  = z.string().min(5).max(30);
export const ImageUrlSchema                  = z.string().url().min(10).max(255);
export const SlugSchema                      = z.string().trim().min(1).max(100).regex(/^[a-zA-Z0-9-_.!$%&'*+=^`|~(){}<>\[\]]+$/);
export const PathnameSchema                  = z.string().trim().min(1).max(255).regex(/^\/?[a-zA-Z0-9-_.!$%&'*+=^`|~(){}<>\[\]]+(\/[a-zA-Z0-9-_.!$%&'*+=^`|~(){}<>\[\]]+)*\/?$/).transform((value): string[] => {
    if (value[0] === '/') value = value.slice(1);
    if (value[value.length - 1] === '/') value = value.slice(0, -1);
    const paths = value.split('/');
    if (paths.length > 10) throw 'Pathname is too deep';
    return paths;
});
export const BooleanStringSchema             = z.enum(['true', 'false']);
export const CurrencyAmountSchema            = z.number().finite();
export const NonNegativeCurrencyAmountSchema = CurrencyAmountSchema.nonnegative();
export const WeightSchema                    = z.number().finite();
export const NonNegativeWeightSchema         = WeightSchema.nonnegative();
export const QuantitySchema                  = z.number().int().finite().nonnegative();

export const LiteralSchema                   = z.union([
    z.null(),
    z.string(),
    z.number(),
    z.boolean(),
]) satisfies z.Schema<Literal>;
export const JsonSchema                      : z.ZodType<Json> = z.lazy(() =>
    z.union([
        LiteralSchema,
        z.array(JsonSchema),
        z.record(JsonSchema),
    ])
) satisfies z.Schema<Json>;
export const JsonSchemaString                = z.string().trim().nullable().refine((value) => {
    try {
        if (value === null) return true;
        JSON.parse(value);
        return true;
    }
    catch {
        return false;
    } // try
}).transform((value): Prisma.JsonValue =>
    (value === null) ? null : JSON.parse(value)
);



export const ModelSchema = z.object({
    id : ModelIdSchema,
}) satisfies z.Schema<Model>;



export const MutationArgsSchema = <TModel extends Model, TModelSchema extends z.ZodTypeAny = z.ZodTypeAny>(ModelSchema: TModelSchema) => (
    z.union([
        (ModelSchema as z.infer<TModelSchema>).pick({ id: true }).required() // the [id] field is required
        .merge(
            (ModelSchema as z.infer<TModelSchema>).omit({ id: true }).partial()  // the [..rest] fields are optional
        ),
        
        /* -or- */
        
        z.object({
            id : EmptyStringSchema
        })
        .merge(
            (ModelSchema as z.infer<TModelSchema>).omit({ id: true }).partial()  // the [..rest] fields are optional
        ),
    ])
) satisfies z.Schema<MutationArgs<TModel>> as z.Schema<MutationArgs<TModel>>;

export const PaginationArgSchema = z.object({
    page    : z.number().int().finite().gte(0),
    perPage : z.number().int().finite().gte(4).lte(50), // minimum 4 for displaying preview of four images
}) satisfies z.Schema<PaginationArgs>;
