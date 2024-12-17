import {
    // cards:
    visa,
    mastercard,
    amex,
    discover,
    jcb,
    maestro,
    electron,
    china_union_pay,
    diners,
    rupay,
    elo,
    hiper,
    hipercard,
    synchrony,
    eftpos,
    solo,
    delta,
    switch_,
    cb_nationale,
    confidis,
    cetelem,
    
    
    
    // wallets:
    paypal,
    googlepay,
    applepay,
    amazonpay,
    link,
    qris,
    gopay,
    shopeepay,
    dana,
    ovo,
    tcash,
    linkaja,
    
    
    
    // otc:
    indomaret,
    alfamart,
}                       from './brand-images'



export const getBrandName = (brand: string|null): string|null => {
    switch (brand?.toLowerCase()) {
        // cards:
        case 'visa'             : return 'Visa';
        case 'mastercard'       : return 'Mastecard';
        case 'amex'             : return 'American Express';
        case 'discover'         : return 'Discover';
        case 'jcb'              : return 'JCB';
        case 'maestro'          : return 'Maestro';
        case 'electron'         : return 'Visa Electron';
        
        case 'china_union_pay'  : return 'China UnionPay';
        case 'diners'           : return 'Diners';
        case 'rupay'            : return 'RuPay';
        case 'elo'              : return 'Elo';
        case 'hiper'            : return 'Hiper';
        case 'hipercard'        : return 'Hipercard';
        case 'synchrony'        : return 'Synchrony';
        case 'ge'               : return 'GE';
        case 'eftpos'           : return 'EFTPOS';
        case 'solo'             : return 'Solo';
        case 'star'             : return 'Star'; // 'Military Star'
        case 'delta'            : return 'Delta'; // 'Delta Airlines'
        case 'switch'           : return 'Switch';
        case 'cb_nationale'     : return 'Carte Bancaire'; // 'CB Nationale'
        case 'configoga'        : return 'Configoga';
        case 'confidis'         : return 'Confidis';
        case 'cetelem'          : return 'Cetelem';
        
        
        
        // wallets:
        case 'paypal'           : return paypal;
        case 'googlepay'        : return googlepay;
        case 'applepay'         : return applepay;
        case 'amazonpay'        : return amazonpay;
        case 'link'             : return link;
        case 'qris'             : return qris;
        case 'gopay'            : return gopay;
        case 'shopeepay'        : return shopeepay;
        case 'dana'             : return dana;
        case 'ovo'              : return ovo;
        case 'tcash'            : return tcash;
        case 'linkaja'          : return linkaja;
        
        
        
        // otc:
        case 'indomaret'        : return indomaret;
        case 'alfamart'         : return alfamart;
        
        
        
        // unknown:
        default                 : return null;
    } // switch
}
export const getBrandLogo = (brand: string|null): string|null => {
    switch (brand?.toLowerCase()) {
        // cards:
        case 'visa'             : return visa;
        case 'mastercard'       : return mastercard;
        case 'amex'             : return amex;
        case 'discover'         : return discover;
        case 'jcb'              : return jcb;
        case 'maestro'          : return maestro;
        case 'electron'         : return electron;
        
        case 'china_union_pay'  : return china_union_pay;
        case 'diners'           : return diners;
        case 'rupay'            : return rupay;
        case 'elo'              : return elo;
        case 'hiper'            : return hiper;
        case 'hipercard'        : return hipercard;
        case 'synchrony'        : return synchrony;
        // case 'ge':
        case 'eftpos'           : return eftpos;
        case 'solo'             : return solo;
        // case 'star':
        case 'delta'            : return delta;
        case 'switch'           : return switch_;
        case 'cb_nationale'     : return cb_nationale;
        // case 'configoga':
        case 'confidis'         : return confidis;
        case 'cetelem'          : return cetelem;
        
        
        
        // wallets:
        case 'paypal'           : return paypal;
        case 'googlepay'        : return googlepay;
        case 'applepay'         : return applepay;
        case 'amazonpay'        : return amazonpay;
        case 'link'             : return link;
        case 'qris'             : return qris;
        case 'gopay'            : return gopay;
        case 'shopeepay'        : return shopeepay;
        case 'dana'             : return dana;
        case 'ovo'              : return ovo;
        case 'tcash'            : return tcash;
        case 'linkaja'          : return linkaja;
        
        
        
        // otc:
        case 'indomaret'        : return indomaret;
        case 'alfamart'         : return alfamart;
        
        
        
        // unknown:
        default                 : return null;
    } // switch
}
