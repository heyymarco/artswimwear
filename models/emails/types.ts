// webs:
import {
    default as Mail,
}                           from 'nodemailer/lib/mailer'



export interface SendEmailData {
    from        : string
    to          : string|string[]
    
    subject     : string
    html        : string
    attachments : Mail.Attachment[]
}