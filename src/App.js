import React, { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import Parse from "./api/parseConfig";
import Modal from "./components/Modal";
import signUp from "./api/auth/signUp";
import logIn from "./api/auth/logIn";
import save from "./api/queries/save";
import deleteQuery from "./api/queries/delete";
import update from "./api/queries/update";
import subscribe from "./api/subscribe/subscribe";

  const inputStyle = {
    height: 52,
    width: "91.5%",
    border: "1px solid #e0e0e0",
    borderRadius: 8,
    marginBottom: 16,
    padding: "0 16px",
    fontSize: 16,
  };

  const buttonStyle = {
    background: "#007bff",
    color: "#fff",
    height: 52,
    border: "none",
    borderRadius: 8,
    padding: "0 32px",
    fontWeight: "bold",
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    boxShadow: "0 2px 4px #0001",
    marginTop: 8,
  };

  const buttonSecondary = {
    ...buttonStyle,
    background: "#f3f5f7",
    color: "#1a237e",
    fontWeight: 500,
    boxShadow: "none",
  };

  function App() {
    const [user, setUser] = useState(null);
    const [login, setLogin] = useState({ username: "", password: "" });
    const [signup, setSignup] = useState({ username: "", password: "", email: "" });
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [taskTitle, setTaskTitle] = useState("");
    const [showLogin, setShowLogin] = useState(true);
    const [showSignup, setShowSignup] = useState(false);
    const [showAddTask, setShowAddTask] = useState(false);
    const [showUpdateTask, setShowUpdateTask] = useState(false);

    useEffect(() => {
      const currentUser = Parse.User.current();
      if (currentUser) setUser(currentUser);
    }, []);

    useEffect(() => {
      if (user) {
        fetchTasks();
      } 
    }, [user]);

    useEffect(() => {
      subscribe("Task").catch(err => console.log("Subscribe on Task error: ", err))
    }, []);

    async function handleLogin(e) {
      e.preventDefault();
      try {
        const u = await logIn(login.username, login.password);
        setUser(u);
      } catch (err) {
        alert("Login failed!");
      }
    }

    async function handleSignup(e) {
      e.preventDefault();    
      try {
        await signUp({ 
          username: signup.username,
          email: signup.email,
          password: signup.password
        });
        alert("Sign up successful! You can now log in.");
        setShowSignup(false); setShowLogin(true);
        setSignup({ username: "", password: "", email: "" });
      } catch (err) {
        alert("Sign up failed: " + err.message);
      }
    }

    const handleLogout = async () => {
      await Parse.User.logOut();
      setUser(null);
      setTasks([]);
    };

    async function fetchTasks() {
      const Task = Parse.Object.extend("Task");
      const query = new Parse.Query(Task);
      query.equalTo("user", Parse.User.current());
      const results = await query.find();
      setTasks(
        results.map(task => ({
          id: task.id,
          title: task.get("title"),
          completed: task.get("completed"),
        }))
      );
    }

    async function addTask(e) {
      e.preventDefault();
      if (!taskTitle) return;

      try {
        await save("Task", {
          title: taskTitle,
          completed: false,
          user: Parse.User.current(),
        });

        setShowAddTask(false);
        setTaskTitle("");
        fetchTasks();
      } catch (error) {
        console.error("Error to save task:", error);
        throw error;
      }
    }

    async function updateTask(e) {
      e.preventDefault();
      if (!editingTask) return;
    
      try {
        await update("Task", editingTask.id, { title: taskTitle });
        setShowUpdateTask(false);
        setEditingTask(null);
        setTaskTitle("");
        fetchTasks();
      } catch (error) {
        alert("Failed to update task: " + error.message);
      }
    }
    

    async function removeTask(taskId) {
      try {
        await deleteQuery("Task", taskId);
        fetchTasks();
      } catch (error) {
        alert("Failed to delete task: " + error.message);
      }
    }

    const LoginModal = (
      <Modal open={showLogin && !user} onClose={() => {}}>
        <h2 style={{ textAlign: "center" }}>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            style={inputStyle}
            placeholder="Username"
            value={login.username}
            onChange={e => setLogin({ ...login, username: e.target.value })}
          /><br/>
          <input
            style={inputStyle}
            placeholder="Password"
            type="password"
            value={login.password}
            onChange={e => setLogin({ ...login, password: e.target.value })}
          /><br/>
          <button style={buttonStyle} type="submit">
            Login
          </button>
          <button
            style={{ ...buttonSecondary }}
            type="button"
            onClick={() => { setShowLogin(false); setShowSignup(true); }}
          >
            Sign up
          </button>
        </form>
      </Modal>
    );

    const SignupModal = (
      <Modal open={showSignup && !user} onClose={() => { setShowSignup(false); setShowLogin(true); }}>
        <h2 style={{ textAlign: "center" }}>Sign up</h2>
        <form onSubmit={handleSignup}>
          <input
            style={inputStyle}
            placeholder="Username"
            value={signup.username}
            onChange={e => setSignup({ ...signup, username: e.target.value })}
          /><br />
          <input
            style={inputStyle}
            placeholder="Password"
            type="password"
            value={signup.password}
            onChange={e => setSignup({ ...signup, password: e.target.value })}
          /><br />
          <input
            style={inputStyle}
            placeholder="Email"
            type="email"
            value={signup.email}
            onChange={e => setSignup({ ...signup, email: e.target.value })}
          /><br />
          <button
            style={buttonStyle} 
            type="submit"
          >
            Sign up
          </button>
          <button
            style={{ ...buttonSecondary }}
            type="button"
            onClick={() => { setShowSignup(false); setShowLogin(true); }}
          >
            Back to login
          </button>
        </form>
      </Modal>
    );

    const AddTaskModal = (
      <Modal open={showAddTask} onClose={() => setShowAddTask(false)}>
        <h2 style={{ textAlign: "center" }}>Add Task</h2>
        <form onSubmit={addTask}>
          <input
            style={inputStyle}
            placeholder="Task title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            autoFocus
          />
          <button
            style={buttonStyle}
            type="submit"
          >
            <span style={{ fontSize: 26, fontWeight: "bold", lineHeight: "1" }}> + </span> Add
          </button>
          <button
            style={buttonSecondary}
            type="button"
            onClick={() => setShowAddTask(false)}
          >Cancel</button>
        </form>
      </Modal>
    );

    const UpdateTaskModal = (
      <Modal open={showUpdateTask} onClose={() => setShowUpdateTask(false)}>
        <h2 style={{ textAlign: "center" }}>Update Task</h2>
        <form onSubmit={updateTask}>
          <input
            style={inputStyle}
            placeholder="Task title"
            value={taskTitle}
            onChange={e => setTaskTitle(e.target.value)}
            autoFocus
          />
          <button
            style={buttonStyle}
            type="submit"
          >
            <span style={{ fontSize: 26, fontWeight: "bold", lineHeight: "1" }}> + </span> Save
          </button>
          <button
            style={buttonSecondary}
            type="button"
            onClick={() => setShowAddTask(false)}
          >Cancel</button>
        </form>
      </Modal>
    );

    if (!user) {
      return (
        <>
          {LoginModal}
          {SignupModal}
        </>
      );
    }

    return (
      <>
        <TopBar username={user.get("username")} onLogout={handleLogout} />
        <div
          style={{
            maxWidth: 500,
            margin: "40px auto",
            paddingTop: 72,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <button
              onClick={() => setShowAddTask(true)}
              style={buttonStyle}
            >
              <span style={{ fontSize: 26, fontWeight: "bold", lineHeight: "1" }}>+</span>
              Add
            </button>
          </div>

          {tasks.length === 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 180,
                color: "#888",
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 0.2,
                flexDirection: "column"
              }}
            >
              <span>No tasks yet</span>
              <span style={{ fontSize: 56, color: "#007bff" }}>📄</span>
            </div>
          ) : (
            <ul style={{ padding: 0, listStyle: "none" }}>
              {tasks.map((t) => (
                <li key={t.id} style={{
                  background: "#f3f5f7",
                  margin: "12px 0",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 18px"
                }}>
                  <span><b>{t.title}</b> {t.completed ? "(completed)" : ""}</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      style={{
                        ...buttonSecondary,
                        color: "#fff",
                        background: "#007BFF",
                        width: 90,
                        justifyContent: "center",
                        gap: 0,
                        fontWeight: "bold",
                      }}
                      onClick={() => {
                        setEditingTask(t);
                        setTaskTitle(t.title);
                        setShowUpdateTask(true);
                      }}
                    >
                      Update
                    </button>
                    <button
                      style={{
                        ...buttonSecondary,
                        color: "#fff",
                        background: "#f44336",
                        width: 90,
                        justifyContent: "center",
                        gap: 0,
                        fontWeight: "bold",
                      }}
                      onClick={() => removeTask(t.id)}
                    >
                      Delete
                    </button>
                    {
                      t.completed == false ?
                        <button
                          style={{
                            ...buttonSecondary,
                            color: "#fff",
                            background: "#00FC0C",
                            width: 90,
                            justifyContent: "center",
                            gap: 0,
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            update("Task", t.id, { completed: true })
                            fetchTasks()
                          }}
                        >
                          Complete
                        </button>
                      : 
                        <div>
                          <span style={{ fontSize: 54 }}>✅</span>
                        </div>
                    }
                  </div>              
                </li>
              ))}
            </ul>
          )}
        </div>
        {AddTaskModal}
        {UpdateTaskModal}
      </>
    );
  }

  export default App;