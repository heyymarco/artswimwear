// react:
import {
    // react:
    default as React,
    
    
    
    // hooks:
    useState,
    useMemo,
    useEffect,
}                           from 'react'

// heymarco components:
import {
    // react components:
    SelectCountryEditor,
}                           from '@heymarco/select-country-editor'
import {
    // react components:
    SelectStateEditor,
}                           from '@heymarco/select-state-editor'
import {
    // react components:
    SelectCityEditor,
}                           from '@heymarco/select-city-editor'
import {
    TextEditor,
}                           from '@heymarco/text-editor'
import {
    NameEditor,
}                           from '@heymarco/name-editor'
import {
    PhoneEditor,
}                           from '@heymarco/phone-editor'
import {
    // react components:
    AddressEditorProps as BaseAddressEditorProps,
    AddressEditor      as BaseAddressEditor,
}                           from '@heymarco/address-editor'
export {
    type Address,
}                           from '@heymarco/address-editor'

// stores:
import {
    // hooks:
    // useGetCountryList,
    // useGetStateList,
    // useGetCityList,
    
    
    
    // apis:
    getCountryList,
    getStateList,
    getCityList,
}                           from '@/store/features/api/apiSlice'
import {
    // hooks:
    useAppDispatch,
}                           from '@/store/hooks'



// react components:
export interface AddressEditorProps<out TElement extends Element = HTMLFormElement>
    extends
        // bases:
        BaseAddressEditorProps<TElement>
{
    // refs:
    addressRef ?: React.Ref<HTMLInputElement> // setter ref
}
const AddressEditor = <TElement extends Element = HTMLFormElement>(props: AddressEditorProps<TElement>): JSX.Element|null => {
    // props:
    const {
        // refs:
        addressRef,
        
        
        
        // other props:
        ...restAddressEditorProps
    } = props;
    
    
    // states:
    const [country, setCountry] = useState<string>(props.value?.country ?? '');
    const [state  , setState  ] = useState<string>(props.value?.state   ?? '');
    
    
    
    // stores:
    const dispatch = useAppDispatch();
    
    const [mountedPromise, mountedSignal] = useMemo<[Promise<boolean>, (value: boolean) => void]>(() => {
        const { promise, resolve } = Promise.withResolvers<boolean>();
        return [promise, resolve];
    }, []);
    useEffect(() => {
        // setups:
        mountedSignal(true); // signal that the component is mounted
        
        
        
        // cleanups:
        return () => {
            mountedSignal(false); // signal that the component is never mounted
        };
    }, [mountedSignal]);
    
    const countryOptionsPromise = useMemo(() => {
        return mountedPromise.then(async (isMounted) => {
            // conditions:
            if (!isMounted) return []; // the component was unmounted before waiting for fully_mounted => return empty
            
            
            
            // actions:
            return (
                Array.from(
                    Object.values(
                        (await dispatch(getCountryList()).unwrap())
                        .entities
                    )
                )
                .filter((entity): entity is Exclude<typeof entity, undefined> => (entity !== undefined))
                .map(({name}) => name)
            );
        });
    }, [mountedPromise]);
    const stateOptionsPromise = useMemo(() => {
        if (!country) return [];
        return mountedPromise.then((isMounted) => {
            // conditions:
            if (!isMounted) return []; // the component was unmounted before waiting for fully_mounted => return empty
            
            
            
            // actions:
            return dispatch(getStateList({ countryCode: country })).unwrap();
        });
    }, [mountedPromise, country]);
    const cityOptionsPromise = useMemo(() => {
        if (!country) return [];
        if (!state) return [];
        return mountedPromise.then((isMounted) => {
            // conditions:
            if (!isMounted) return []; // the component was unmounted before waiting for fully_mounted => return empty
            
            
            
            // actions:
            return dispatch(getCityList({ countryCode: country, state: state })).unwrap();
        });
    }, [mountedPromise, country, state]);
    
    
    
    // default props:
    const {
        // components:
        countryEditorComponent=(
            <SelectCountryEditor theme='primary' onChange={setCountry} valueOptions={countryOptionsPromise} />
        ),
        stateEditorComponent=(
            <SelectStateEditor theme='primary' onChange={setState} valueOptions={stateOptionsPromise} minLength={3} maxLength={50} />
        ),
        cityEditorComponent=(
            <SelectCityEditor theme='primary' valueOptions={cityOptionsPromise} minLength={3} maxLength={50} />
        ),
        zipEditorComponent=(
            <TextEditor aria-label='Zip (Postal) Code' minLength={2} maxLength={11} />
        ),
        addressEditorComponent=(
            <TextEditor aria-label='Street Address' minLength={5} maxLength={90} elmRef={addressRef} />
        ),
        firstNameEditorComponent=(
            <NameEditor aria-label='First Name' minLength={2} maxLength={30} />
        ),
        lastNameEditorComponent=(
            <NameEditor aria-label='Last Name' minLength={1} maxLength={30} />
        ),
        phoneEditorComponent=(
            <PhoneEditor minLength={5} maxLength={15} />
        ),
        
        
        
        // other props:
        ...restBaseAddressEditorProps
    } = restAddressEditorProps;
    
    
    
    // jsx:
    return (
        <BaseAddressEditor<TElement>
            // other props:
            {...restBaseAddressEditorProps}
            
            
            
            // components:
            countryEditorComponent={countryEditorComponent}
            stateEditorComponent={stateEditorComponent}
            cityEditorComponent={cityEditorComponent}
            zipEditorComponent={zipEditorComponent}
            addressEditorComponent={addressEditorComponent}
            companyEditorComponent={null}
            firstNameEditorComponent={firstNameEditorComponent}
            lastNameEditorComponent={lastNameEditorComponent}
            phoneEditorComponent={phoneEditorComponent}
        />
    );
};
export {
    AddressEditor,            // named export for readibility
    AddressEditor as default, // default export to support React.lazy
}
