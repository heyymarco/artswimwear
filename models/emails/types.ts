// webs:
import {
    default as Mail,
}                           from 'nodemailer/lib/mailer'



export interface SendEmailData {
    host        : string
    port        : number
    secure      : boolean
    user        : string
    pass        : string
    
    from        : string
    to          : string|string[]
    
    subject     : string
    html        : string
    attachments : Mail.Attachment[]
}