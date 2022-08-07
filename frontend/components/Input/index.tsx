import {styled} from "@stitches/react";

export const Input = styled('input', {
    borderRadius: '5px',
    border: '1px solid rgba(0,0,0,.1)',
    fontSize: '14px',
    padding: '6px 6px',
    '&:focus': {
        outline: '2px solid #2D60D6'
    }
});