import { useAuth } from "../../../store";
import { styled } from "../../../../stitches.config";
import { Flex } from "../../../../components/Flex";
import { Input, Textarea } from "../../../../components/Input";
import { Button, IconButton } from "../../../../components/Button";
import { Box } from "../../../../components/Box";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { StatusType } from "../../../services/Task";
import { useUser } from "../../../hooks/users";


const Span = styled('span')
const Form = styled('form')
const Select = styled('select')


export const UserEdit: FC = () => {
	const { id } = useParams();
	const { user, loading } = useUser(String(id));
	const [error, setError] = useState();
	const formRef = useRef<HTMLFormElement>();
	const navigate = useNavigate();
	const handleAddTodo = (e: any) => {
		e.preventDefault();
		if (user) {
			user.update({
				name: e.target.elements.name.value,
				password: e.target.elements.password.value,
			}).then(() => {
				navigate("/user");
			}).catch((e) => {
				if (e.response._data?.message) {
					setError(e.response._data?.message)
				}
			})
		}
	}

	useEffect(() => {
		if (user) {
			if (typeof formRef.current !== 'undefined') {
				(formRef.current?.elements as any).name.value = user.name;
			}
		}
	}, [user])

	if (loading)
		return <Span>Loading...</Span>

	if (!loading && !user)
		return <Span>Invalid user!</Span>


	return <Flex css={{
		flexDirection: 'column',
		height: '100vh'
	}}>
		<Span css={{
			color: 'white',
			backgroundColor: '$primary',
			padding: '10px 8px'
		}}>

			<Box css={{ display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
				Task Management {">"} Edit
			</Box>
		</Span>
		<Form ref={formRef as RefObject<HTMLFormElement>}
			css={{
				display: 'flex', flexDirection: 'column', padding: '0 20px',
				"@bp3": {
					width: '500px',
					margin: '0 auto'
				}
			}}
			onSubmit={handleAddTodo}>
			<Span css={{
				fontWeight: '700',
				padding: '10px 0'
			}}>Edit Task</Span>
			<Input name="name"
				css={{ backgroundColor: 'rgba(0,0,0,.1)', margin: '10px 0', '&:focus': { backgroundColor: 'white' } }}
				placeholder={"Name"}></Input>
			<Input name="password"
				type={"password"}
				css={{ backgroundColor: 'rgba(0,0,0,.1)', margin: '10px 0', '&:focus': { backgroundColor: 'white' } }}
				placeholder={"Password"}></Input>
			{
				error ? <Box css={{ backgroundColor: "rgba(255,0,0,0.2)", padding: '10px 15px', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}>{error}</Box> : null
			}
			<Button css={{}}>Update</Button>
		</Form>
	</Flex>
}
