// utilities:
const friendlyNameCarriers = new Map<string, string>([
    ['USPS'        , 'USPS'],
    
    ['FedExDefault', 'FedEx'],
    
    ['DHL'         , 'DHL'],
    ['DHLExpress'  , 'DHL'],
    
    ['UPS'         , 'UPS'],
    
    ['CanadaPost'  , 'Canada Post'],
    
    ['LSO'         , 'LSO'],
]);
const friendlyNameShipping = new Map<string, string>([
    // USPS:
    
    // US:
    ['USPS First'                                , 'USPS First'],
    ['USPS Priority'                             , 'USPS Priority'],
    ['USPS Express'                              , 'USPS Express'],
    
    ['USPS GroundAdvantage'                      , 'USPS Ground Advantage'],
    ['USPS LibraryMail'                          , 'USPS Library Mail'],
    ['USPS MediaMail'                            , 'USPS Media Mail'],
    
    // International:
    ['USPS FirstClassMailInternational'          , 'USPS First Class Mail International'],
    ['USPS FirstClassPackageInternationalService', 'USPS First Class Package International Service'],
    ['USPS PriorityMailInternational'            , 'USPS Priority Mail International'],
    ['USPS ExpressMailInternational'             , 'USPS Express Mail International'],
    
    
    
    // FedEx:
    
    // US:
    ['FedEx FEDEX_2_DAY'                      , 'FedEx 2 Day'],
    ['FedEx FEDEX_2_DAY_AM'                   , 'FedEx 2 Day AM'],
    ['FedEx FEDEX_EXPRESS_SAVER'              , 'FedEx Express Saver'],
    ['FedEx FEDEX_GROUND'                     , 'FedEx Ground'],
    ['FedEx FEDEX_FIRST_OVERNIGHT'            , 'FedEx First Overnight'],
    ['FedEx FEDEX_GROUND_HOME_DELIVERY'       , 'FedEx Ground Home Delivery'],
    ['FedEx FEDEX_PRIORITY_OVERNIGHT'         , 'FedEx Priority Overnight'],
    ['FedEx FEDEX_SMART_POST'                 , 'FedEx Smart Post'],
    ['FedEx FEDEX_STANDARD_OVERNIGHT'         , 'FedEx Standard Overnight'],
    // Aliases:
    ['FedEx 2_DAY'                            , 'FedEx 2 Day'],
    ['FedEx 2_DAY_AM'                         , 'FedEx 2 Day AM'],
    ['FedEx EXPRESS_SAVER'                    , 'FedEx Express Saver'],
    ['FedEx GROUND'                           , 'FedEx Ground'],
    ['FedEx FIRST_OVERNIGHT'                  , 'FedEx First Overnight'],
    ['FedEx GROUND_HOME_DELIVERY'             , 'FedEx Ground Home Delivery'],
    ['FedEx PRIORITY_OVERNIGHT'               , 'FedEx Priority Overnight'],
    ['FedEx SMART_POST'                       , 'FedEx Smart Post'],
    ['FedEx STANDARD_OVERNIGHT'               , 'FedEx Standard Overnight'],
    
    // International:
    ['FedEx FEDEX_INTERNATIONAL_CONNECT_PLUS' , 'FedEx International Connect Plus'],
    ['FedEx FEDEX_INTERNATIONAL_ECONOMY'      , 'FedEx International Economy'],
    ['FedEx FEDEX_INTERNATIONAL_FIRST'        , 'FedEx International First'],
    ['FedEx FEDEX_INTERNATIONAL_PRIORITY'     , 'FedEx International Priority'],
    // Aliases:
    ['FedEx INTERNATIONAL_CONNECT_PLUS'       , 'FedEx International Connect Plus'],
    ['FedEx INTERNATIONAL_ECONOMY'            , 'FedEx International Economy'],
    ['FedEx INTERNATIONAL_FIRST'              , 'FedEx International First'],
    ['FedEx INTERNATIONAL_PRIORITY'           , 'FedEx International Priority'],
    
    
    
    // DHL Express:
    ['DHL BreakBulkEconomy'             ,'DHL Break Bulk Economy'],
    ['DHL BreakBulkExpress'             ,'DHL Break Bulk Express'],
    ['DHL DomesticEconomySelect'        ,'DHL Domestic Economy Select'],
    ['DHL DomesticExpress'              ,'DHL Domestic Express'],
    ['DHL DomesticExpress1030'          ,'DHL Domestic Express 1030'],
    ['DHL DomesticExpress1200'          ,'DHL Domestic Express 1200'],
    ['DHL EconomySelect'                ,'DHL Economy Select'],
    ['DHL EconomySelectNonDoc'          ,'DHL Economy Select Non Doc'],
    ['DHL EuroPack'                     ,'DHL Europack'],
    ['DHL EuropackNonDoc'               ,'DHL Europack Non Doc'],
    ['DHL Express1030'                  ,'DHL Express 1030'],
    ['DHL Express1030NonDoc'            ,'DHL Express 1030 Non Doc'],
    ['DHL Express1200NonDoc'            ,'DHL Express 1200 Non Doc'],
    ['DHL Express1200'                  ,'DHL Express 1200'],
    ['DHL Express900'                   ,'DHL Express 900'],
    ['DHL Express900NonDoc'             ,'DHL Express 900 Non Doc'],
    ['DHL ExpressEasy'                  ,'DHL Express Easy'],
    ['DHL ExpressEasyNonDoc'            ,'DHL Express Easy Non Doc'],
    ['DHL ExpressEnvelope'              ,'DHL Express Envelope'],
    ['DHL ExpressWorldwide'             ,'DHL Express Worldwide'],
    ['DHL ExpressWorldwideB2C'          ,'DHL Express Worldwide B2C'],
    ['DHL ExpressWorldwideB2CNonDoc'    ,'DHL Express Worldwide B2C Non Doc'],
    ['DHL ExpressWorldwideECX'          ,'DHL Express Worldwide ECX'],
    ['DHL ExpressWorldwideNonDoc'       ,'DHL Express Worldwide Non Doc'],
    ['DHL FreightWorldwide'             ,'DHL Freight Worldwide'],
    ['DHL GlobalmailBusiness'           ,'DHL Global Mail Business'],
    ['DHL JetLine'                      ,'DHL Jet Line'],
    ['DHL JumboBox'                     ,'DHL Jumbo Box'],
    ['DHL LogisticsServices'            ,'DHL Logistics Services'],
    ['DHL SameDay'                      ,'DHL Same Day'],
    ['DHL SecureLine'                   ,'DHL Secure Line'],
    ['DHL SprintLine'                   ,'DHL Sprint Line'],
    
    
    
    // UPS:
    ['UPS Ground'               , 'UPS Ground'],
    ['UPS UPSStandard'          , 'UPS Standard'],
    ['UPS UPSSaver'             , 'UPS Saver'],
    ['UPS Express'              , 'UPS Express'],
    ['UPS ExpressPlus'          , 'UPS Express Plus'],
    ['UPS Expedited'            , 'UPS Expedited'],
    ['UPS NextDayAir'           , 'UPS Next Day Air'],
    ['UPS NextDayAirSaver'      , 'UPS Next Day Air Saver'],
    ['UPS NextDayAirEarlyAM'    , 'UPS Next Day Air Early AM'],
    ['UPS 2ndDayAir'            , 'UPS 2nd Day Air'],
    ['UPS 2ndDayAirAM'          , 'UPS 2nd Day Air AM'],
    ['UPS 3DaySelect'           , 'UPS 3Day Select'],
    
    
    
    // Canada Post:
    
    // Canada:
    ['Canada Post RegularParcel'                    , 'Canada Post Regular Parcel'],
    ['Canada Post ExpeditedParcel'                  , 'Canada Post Expedited Parcel'],
    ['Canada Post Xpresspost'                       , 'Canada Post Xpresspost'],
    ['Canada Post Priority'                         , 'Canada Post Priority'],
    
    // US:
    ['Canada Post ExpeditedParcelUSA'               , 'Canada Post Expedited Parcel USA'],
    ['Canada Post SmallPacketUSAAir'                , 'Canada Post Small Packet USA Air'],
    ['Canada Post TrackedPacketUSA'                 , 'Canada Post Tracked Packet USA'],
    ['Canada Post TrackedPacketUSALVM'              , 'Canada Post Tracked Packet USA LVM'],
    ['Canada Post XpresspostUSA'                    , 'Canada Post Xpresspost USA'],
    
    // International:
    ['Canada Post XpresspostInternational'          , 'Canada Post Xpresspost International'],
    ['Canada Post InternationalParcelAir'           , 'Canada Post International Parcel Air'],
    ['Canada Post InternationalParcelSurface'       , 'Canada Post International Parcel Surface'],
    ['Canada Post SmallPacketInternationalAir'      , 'Canada Post Small Packet International Air'],
    ['Canada Post SmallPacketInternationalSurface'  , 'Canada Post Small Packet International Surface'],
    ['Canada Post TrackedPacketInternational'       , 'Canada Post Tracked Packet International'],
    ['Canada Post ExpeditedParcelPlus'              , 'Canada Post Expedited Parcel Plus'],
    
    
    
    // LSO:
    ['LSO PriorityEarly'    , 'LSO Priority Early'],
    ['LSO PriorityBasic'    , 'LSO Priority Basic'],
    ['LSO Priority2ndDay'   , 'LSO Priority 2nd Day'],
    ['LSO GroundEarly'      , 'LSO Ground Early'],
    ['LSO GroundBasic'      , 'LSO Ground Basic'],
    ['LSO ECommerce'        , 'LSO Ecommerce'],
]);
export const normalizeShippingProviderName = (carrier: string, service: string): string => {
    const carrierNameRaw   = carrier;
    const carrierName      = friendlyNameCarriers.get(carrierNameRaw) ?? carrierNameRaw;
    const serviceNameRaw   = service;
    const combinedNameRaw  = `${carrierName} ${serviceNameRaw}`;
    const combinedName     = friendlyNameShipping.get(combinedNameRaw) ?? combinedNameRaw;
    return combinedName;
}