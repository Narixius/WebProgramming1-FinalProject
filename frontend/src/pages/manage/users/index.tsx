import { styled } from "../../../../stitches.config";
import { Flex } from "../../../../components/Flex";
import { Input, Textarea } from "../../../../components/Input";
import { Button, IconButton } from "../../../../components/Button";
import { Box } from "../../../../components/Box";
import { FC, RefObject, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../../../services/User";
import { useUsers } from "../../../hooks/users";


const Span = styled('span')
const Form = styled('form')
export const Users = () => {
	const { users, createUser } = useUsers();
	const formRef = useRef<HTMLFormElement>();
	const [error, setError] = useState();
	const handleAddTodo = (e: any) => {
		e.preventDefault();
		setError(undefined)
		createUser({
			name: e.target.elements.name.value,
			password: e.target.elements.password.value,
			email: e.target.elements.email.value
		}).then(() => {
			if (typeof formRef.current !== 'undefined') {
				(formRef.current.elements as any).name.value = '';
				(formRef.current.elements as any).password.value = "";
				(formRef.current.elements as any).email.value = "";
			}
		}).catch((e) => {
			if (e.response._data?.message) {
				setError(e.response._data.message)
			}
		})
	}
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
				Task Management {">"} Users
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
			}}>Add a new User</Span>
			<Input name="name"
				css={{ backgroundColor: 'rgba(0,0,0,.1)', margin: '10px 0', '&:focus': { backgroundColor: 'white' } }}
				placeholder={"Name"}></Input>
			<Input name="email"
				type={"email"}
				css={{ backgroundColor: 'rgba(0,0,0,.1)', margin: '10px 0', '&:focus': { backgroundColor: 'white' } }}
				placeholder={"Email"}></Input>
			<Input name="password"
				type={"password"}
				css={{ backgroundColor: 'rgba(0,0,0,.1)', margin: '10px 0', '&:focus': { backgroundColor: 'white' } }}
				placeholder={"Password"}></Input>
			{
				error ? <Box css={{ backgroundColor: "rgba(255,0,0,0.2)", padding: '10px 15px', borderRadius: '5px', marginTop: '10px', marginBottom: '10px' }}>{error}</Box> : null
			}
			<Button css={{}}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
			</svg> Add</Button>
		</Form>
		<Box css={{
			backgroundColor: '$primary',
			borderRadius: '10px 10px 0 0',
			marginTop: '10px',
			flexGrow: '1',
			display: 'flex',
			flexDirection: 'column'
		}}>
			<Span css={{
				color: 'white',
				padding: '10px 20px',
				display: 'block',
			}}>
				Users
			</Span>
			<Box css={{
				backgroundColor: '#76baff',
				borderRadius: '10px 10px 0 0',
				padding: '10px 20px',
				display: 'grid',
				gap: '15px',
				flexGrow: '1',
				gridAutoRows: 'minmax(min-content, max-content)',
				gridTemplateColumns: users.length > 0 ? '1fr 1fr' : 'auth',
				"@bp3": {
					gridTemplateColumns: users.length > 0 ? '1fr 1fr 1fr 1fr' : 'auth',
				}
			}}>
				{
					users.length > 0 ? users.map((user) => {
						return <UserCard user={user} key={user.id} />
					})
						: <Box css={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}>
							<Span css={{
								textAlign: 'center',
								display: 'block'
							}}>No user found!</Span>
						</Box>
				}
			</Box>
		</Box>
	</Flex>
}

const UserCard: FC<{ user: User }> = ({ user }) => {
	const handleDeleteUser = () => {
		user.delete();
	}
	return <Box css={{
		background: 'white',
		boxShadow: '1px 2px 5px rgba(0,0,0,0.6)',
		padding: '10px',
		borderRadius: '5px',
		maxHeight: '100px'
	}}>
		<Span css={{
			fontWeight: '700',
			fontSize: '13px',
			display: 'block',
			marginTop: '10px'
		}}>{user.name}</Span>
		<Span css={{
			fontSize: '11px',
			display: 'block',
			marginTop: '10px'
		}}>
			{user.email}
		</Span>
		<Flex css={{
			justifyContent: "space-between",
			alignItems: 'center',
			marginTop: '10px',
		}}>

			<Span css={{
				fontSize: '11px',
				display: 'inline-block',
				backgroundColor: '$primary',
				padding: '3px 10px',
				color: 'white',
				borderRadius: '5px',
			}}>
				{user.role.includes('ROLE_ADMIN') ? 'Admin' : 'User'}
			</Span>
			<Box>
				{
					<IconButton onClick={handleDeleteUser}>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
						</svg>
					</IconButton>
				}
				<Link to={`/user/${user.id}`}>
					<IconButton>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
						</svg>
					</IconButton>
				</Link>
			</Box>
		</Flex>
	</Box>
}
