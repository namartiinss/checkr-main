import './styles.css';
import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import Plus from '../../assets/icons/plus.svg';

import Header from '../../components/Header';
import Message from '../../components/Message';
import Modal from '../../components/Modal';

import { baseUrl } from '../../environments/baseUrl';

interface Task {
  id: number;
  description: string;
  status: string;
}

const TodoApp = () => {
  const notify = (text: string) =>
    toast.error(text, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light'
    });

  const validateUser = sessionStorage.getItem('@checkr');
  const [message, setMessage] = useState('Salvando');
  const [activeMessage, setActiveMessage] = useState(false);
  const idUser = validateUser && JSON.parse(validateUser).id;
  const queryClient = useQueryClient();

  const fetchTasks = async () => {
    const response = await fetch(`${baseUrl}/users/${idUser}/tasks`);
    const data = await response.json();
    return data;
  };

  const { data } = useQuery('tasks', fetchTasks);

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (data && data.tasks) {
      setTasks(data.tasks);
    }
  }, [data]);

  const columns = [
    { id: 'tarefas', title: 'Tarefas' },
    { id: 'fazendo', title: 'Fazendo' },
    { id: 'concluídas', title: 'Concluídas' }
  ];

  const [editableTask, setEditableTask] = useState<Task | null>(null);

  const handleDragStart = (
    e: React.DragEvent<HTMLParagraphElement>,
    id: number
  ) => {
    e.dataTransfer.setData('text/plain', id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>,
    newStatus: string
  ) => {
    setMessage('Movendo...');
    setActiveMessage(true);
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const draggedTask = tasks.find((task) => task.id.toString() === id);

    if (draggedTask) {
      const updatedTasks = tasks.map((task) =>
        task.id.toString() === id ? { ...task, status: newStatus } : task
      );

      try {
        const [newTaskUpdate] = updatedTasks.filter(
          (el) => el.id.toString() === id
        );

        const data = {
          description: newTaskUpdate.description,
          status: newTaskUpdate.status
        };

        const newTaskBD = await fetch(
          `${baseUrl}/users/${idUser}/tasks/${newTaskUpdate.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },

            body: JSON.stringify(data)
          }
        );

        if (newTaskBD.status === 200) {
          const newIndex = parseInt(String(newTaskUpdate.id), 10);
          if (draggedTask.status === newStatus) {
            const newTasks = Array.from(updatedTasks);
            const draggedIndex = newTasks.findIndex(
              (task) => task.id === draggedTask.id
            );

            if (draggedIndex !== -1 && newIndex !== -1) {
              const [removed] = newTasks.splice(draggedIndex, 1);
              newTasks.splice(newIndex, 0, removed);
              setTasks(newTasks);
            }
          } else {
            setTasks(updatedTasks);
          }
        } else {
          notify('Erro ao salvar no banco');
        }
      } catch (error) {
        notify('Erro ao salvar no banco');
        console.log(error);
      } finally {
        setActiveMessage(false);
      }
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);

    try {
      await fetch(`${baseUrl}/users/${idUser}/tasks/${taskId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      notify('Erro ao deletar do banco');
      console.log(error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditableTask(task);
  };

  const handleSaveEdit = async (taskId: number, newText: string) => {
    try {
      setMessage('Salvando...');
      setActiveMessage(true);
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, description: newText } : task
      );

      const [elementModify] = tasks.filter((el) => el.id === taskId);

      const data = {
        description: newText,
        status: elementModify.status
      };

      const newTaskBD = await fetch(
        `${baseUrl}/users/${idUser}/tasks/${taskId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(data)
        }
      );
      if (newTaskBD.status === 200) {
        setTasks(updatedTasks);
        setEditableTask(null);
      }
    } catch (error) {
      notify('Erro ao salvar no banco');
      console.log(error);
    } finally {
      setActiveMessage(false);
    }
  };

  const handleAddTask = async (columnId: string) => {
    setMessage('Criando');
    setActiveMessage(true);
    const newTaskId = tasks.length + 1;

    const newTask: Task = {
      id: newTaskId,
      description: 'Nova Tarefa',
      status: columnId
    };

    try {
      const [status] = columns.filter((el) => el.id === columnId);
      const data = {
        description: 'Nova Tarefa',
        status: status.title
      };
      const newTaskBD = await fetch(`${baseUrl}/users/${idUser}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(data)
      });

      if (newTaskBD.status === 201) {
        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        queryClient.invalidateQueries('tasks');
      }
    } catch (error) {
      notify('Erro ao salvar no banco');
      console.log(error);
    } finally {
      setActiveMessage(false);
    }
  };

  const renderTasks = (status: string) =>
    tasks
      .filter((task) => String(task.status).toLocaleLowerCase() === status)
      .map((task) => (
        <div key={task.id} className="task-container">
          {editableTask && editableTask.id === task.id ? (
            <div>
              <input
                type="text"
                value={editableTask.description}
                onChange={(e) =>
                  setEditableTask({
                    ...editableTask,
                    description: e.target.value
                  })
                }
              />
              <button
                onClick={() =>
                  handleSaveEdit(editableTask.id, editableTask.description)
                }
              >
                Save
              </button>
            </div>
          ) : (
            <div>
              <div
                className="task"
                draggable="true"
                onDragStart={(e) => handleDragStart(e, task.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <p>{task.description}</p>
                <div className="buttons_task">
                  <button
                    className="deletar"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                  <button className="edit" onClick={() => handleEditTask(task)}>
                    Edit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ));

  if (validateUser) {
    return (
      <main style={{ position: 'relative' }}>
        {activeMessage && <Message label={message} />}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Header />
        <Modal />
        <div className="container-task">
          <div className="lanes">
            {columns.map((column) => (
              <div
                style={{ position: 'relative' }}
                key={column.id}
                className="swim-lane"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <div className="heading">
                  <h3>{column.title}</h3>
                </div>
                {renderTasks(column.id)}
                <button
                  className="addTask"
                  onClick={() => handleAddTask(column.id)}
                >
                  <img src={Plus} alt="" />
                  Add task
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  } else {
    return (
      <main
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          height: '100vh'
        }}
      >
        Crie uma conta e acesse essa área <Link to="/">HOME</Link>
      </main>
    );
  }
};

export default TodoApp;
