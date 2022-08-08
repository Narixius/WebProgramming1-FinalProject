import {styled} from "../../stitches.config";

export const Button = styled('button', {
    backgroundColor: '#2D60D6',
    borderRadius: '5px',
    border: '0',
    padding: '6px',
    color: 'white',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent: 'center',
    '& > svg': {
        width: '20px',
        height: '20px'
    }
});

export const IconButton = styled('button',{
    border: 'none',
    color: 'black',
    backgroundColor: 'transparent',
    textAlign: 'center',
    cursor: 'pointer',
    '& > svg': {
        width: '15px',
        height: '15px'
    }
})