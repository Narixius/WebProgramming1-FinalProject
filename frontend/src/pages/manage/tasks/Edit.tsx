import { styled } from "../../../../stitches.config";
import { Flex } from "../../../../components/Flex";
import { Input, Textarea } from "../../../../components/Input";
import { Button } from "../../../../components/Button";
import { Box } from "../../../../components/Box";
import { FC, RefObject, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { StatusType } from "../../../services/Task";
import { useTask, useTaskHistory } from "../../../hooks/tasks";


const Span = styled('span')
const Form = styled('form')
const Select = styled('select')


const statusMap: {
	[Property in StatusType]: StatusType[]
} = {
	'ToDo': ['InProgress'],
	'InProgress': ['InQA', 'Blocked'],
	'Blocked': ['ToDo'],
	'InQA': ['Done', 'ToDo'],
	'Done': ['Deployed'],
	'Deployed': []
}

const historyTypeColor = {
	'update': '#7D6A0C',
	'create': '#32956A',
	'delete': '#7D0C0C'
}
export const TaskEdit: FC = () => {
	const { id } = useParams();
	const { task, loading } = useTask(String(id));
	const taskHistory = useTaskHistory(String(id))
	const formRef = useRef<HTMLFormElement>();
	const navigate = useNavigate();
	const handleAddTodo = (e: any) => {
		e.preventDefault();
		if (task) {
			task.update({
				title: e.target.elements.title.value,
				description: e.target.elements.description.value,
				status: e.target.elements.status.value,
			}).then(() => {
				navigate("/task");
			})
		}
	}

	useEffect(() => {
		if (task) {
			if (typeof formRef.current !== 'undefined') {
				(formRef.current?.elements as any).title.value = task.title;
				(formRef.current?.elements as any).description.value = task.description;
				(formRef.current?.elements as any).status.value = task.status;
			}
		}
	}, [task])

	if (loading)
		return <Span>Loading...</Span>

	if (!loading && !task)
		return <Span>Invalid task!</Span>


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
			<Input name="title"
				css={{ backgroundColor: 'rgba(0,0,0,.1)', margin: '10px 0', '&:focus': { backgroundColor: 'white' } }}
				placeholder={"Title"}></Input>
			<Textarea name="description" css={{
				borderRadius: '5px',
				backgroundColor: 'rgba(0,0,0,.1)',
				margin: '10px 0',
				'&:focus': { backgroundColor: 'white' }
			}} placeholder={"Description"}></Textarea>
			<Select name="status" css={{
				margin: '10px 0',
				borderRadius: '5px',
				fontSize: '14px',
				border: '1px solid rgba(0,0,0,.1)',
				backgroundColor: 'rgba(0,0,0,.1)',
				padding: '5px'
			}}>
				<option value={task?.status}>{task?.status}</option>
				{
					task && statusMap[task.status].map((status, i) => {
						return <option key={i} value={status}>{status}</option>
					})
				}
			</Select>
			<Button css={{}}>Update</Button>
		</Form>
		<Flex css={{
			flexDirection: 'column',
			padding: '10px 8px'
		}}>

			<Span css={{
				display: 'block',
				fontWeight: '700',
				fontSize: '16px',
				margin: '10px 0px'
			}}>Task History</Span>

			{
				taskHistory.history?.map((history, id) => {
					return <Box key={id} css={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: '5px', padding: '10px' }}>
						<Span>
							<Span css={{
								backgroundColor: historyTypeColor[history.type],
								display: 'inline-block',
								borderRadius: '3px',
								padding: '2px 8px',
								color: 'white'
							}}>
								{history.type}
							</Span>
							<Span css={{
								marginLeft: '6px'
							}}>by <b>{history.user.name}</b></Span>
						</Span>
						{
							history.newValue ?
								Object.keys(JSON.parse(String(history.newValue))).map((key) => {
									return <Box css={{
										padding: '10px 10px'
									}} key={key}>
										<Span css={{
											display: 'block',
											fontWeight: '700',
											textTransform: 'capitalize'
										}}>{key}</Span>
										{
											history.lastValue !== null && <Span>{JSON.parse(String(history.lastValue))[key]} {" -> "}</Span>
										}
										<Span>{JSON.parse(String(history.newValue))[key]}</Span>

									</Box>
								}) : ''
						}
					</Box>
				})
			}
		</Flex>
	</Flex>
}
