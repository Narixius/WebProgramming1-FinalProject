import {styled} from "../../stitches.config";

export const Input = styled('input', {
    borderRadius: '5px',
    border: '1px solid rgba(0,0,0,.1)',
    fontSize: '14px',
    padding: '6px 6px',
    fontFamily: 'Roboto',
    '&:focus': {
        outline: '2px solid #2D60D6'
    }
});

export const Textarea = styled('textarea', {
    borderRadius: '5px',
    fontFamily: 'Roboto',
    border: '1px solid rgba(0,0,0,.1)',
    fontSize: '14px',
    padding: '6px 6px',
    minHeight: '70px',
    '&:focus': {
        outline: '2px solid #2D60D6'
    }
});