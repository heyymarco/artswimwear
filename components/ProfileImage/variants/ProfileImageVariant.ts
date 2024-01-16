// defaults:
const _defaultProfileImageStyle : ProfileImageStyle = 'regular'



// hooks:

// variants:

//#region ProfileImageVariant
export type ProfileImageStyle = 'regular'|'circle'|'cornered' // might be added more styles in the future
export interface ProfileImageVariant {
    profileImageStyle ?: ProfileImageStyle
}
export const useProfileImageVariant = ({profileImageStyle = _defaultProfileImageStyle}: ProfileImageVariant) => {
    return {
        class: (profileImageStyle === 'regular') ? null : profileImageStyle,
    };
};
//#endregion ProfileImageVariant
