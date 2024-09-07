// react:
import {
    // react:
    default as React,
}                           from 'react'

// reusable-ui components:
import {
    // dialog-components:
    type ModalExpandedChangeEvent,
    type ModalProps,
    Modal,
}                           from '@reusable-ui/components'          // a set of official Reusable-UI components



// react components:
export interface DummyDialogProps<TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<any> = ModalExpandedChangeEvent<any>>
    extends
        // bases:
        Omit<ModalProps<TElement, TModalExpandedChangeEvent>,
            // children:
            |'children' // not supported
        >
{
}
const DummyDialog = <TElement extends Element = HTMLElement, TModalExpandedChangeEvent extends ModalExpandedChangeEvent<any> = ModalExpandedChangeEvent<any>>(props: DummyDialogProps<TElement, TModalExpandedChangeEvent>): JSX.Element|null => {
    return (
        <Modal<TElement, TModalExpandedChangeEvent>
            // other props:
            {...props}
        >
            <div />
        </Modal>
    );
};
export {
    DummyDialog,
    DummyDialog as default,
}
