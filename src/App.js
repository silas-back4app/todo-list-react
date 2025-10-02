import React, { useState, useEffect } from "react";
import TopBar from "./components/TopBar";
import Parse from "./api/parseConfig";
import Modal from "./components/Modal";
import { signUp } from "./api/auth/auth";


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

    const [totalTasks, setTotalTasks] = useState(0)

    useEffect(() => {
      const currentUser = Parse.User.current();
      if (currentUser) {
        setUser(currentUser);
        fetchUserTasks();
      }
    }, []);

    useEffect(() => {
      fetchUserTasks();
    }, []);

    useEffect(() => {
      let subscription;
    
      async function initSubscription() {
        const currentUser = Parse.User.current();
        if (!currentUser) return;
        
        const query = new Parse.Query("Task");
        subscription = await query.subscribe();
    
        subscription.on("create", async () => {
          const total = await Parse.Cloud.run("countTasks", {}, { sessionToken: currentUser.getSessionToken() });
          setTotalTasks(total.count);
        }); 
    
        subscription.on("delete", async () => {
          const total = await await Parse.Cloud.run("countTasks", {}, { sessionToken: currentUser.getSessionToken() });
          setTotalTasks(total.count);
        });
      }
    
      initSubscription();
    
      return () => {
        if (subscription) subscription.unsubscribe();
      };
    }, []);
    

    async function handleLogin(e) {
      e.preventDefault();
      try {
        const { username, password } = login;

        const response = await Parse.Cloud.run("logIn", { username, password });

        if (!response.success) throw new Error("Login failed");

        const userLogged = await Parse.User.become(response.sessionToken);

        console.log(userLogged)

        setUser(userLogged);
        setLogin({ username: "", password: "" });

        fetchUserTasks();
      } catch (err) {
        console.log("Login error: ", err);
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
      try {
        const currentUser = Parse.User.current();
        if (!currentUser) return;
    
        await Parse.User.logOut();
        
        setUser(null);
        setShowLogin(true);
        setTasks([]);
      } catch (error) {
        console.error("Error on logout:", error);
      }     
    };
    

    async function fetchUserTasks() {
      try {
        const currentUser = Parse.User.current();

        const tasks = await Parse.Cloud.run("fetchUserTasks", {}, { sessionToken: currentUser.getSessionToken() });
        const mappedTasks = tasks.map(t => t.toJSON());
        console.log(mappedTasks)
        setTasks(mappedTasks);
        setTotalTasks(mappedTasks.length)
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }   

    async function addTask(e) {
      e.preventDefault();
      try {
        const currentUser = Parse.User.current();

        await Parse.Cloud.run("addTask", { title: taskTitle }, { sessionToken: currentUser.getSessionToken() });
        setTaskTitle("");
        setShowAddTask(false);
        fetchUserTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
    
    async function updateTask(taskId, title, completed) {
      try {
        const currentUser = Parse.User.current();

        await Parse.Cloud.run("updateTask", { taskId, title, completed }, { sessionToken: currentUser.getSessionToken() });
        setTaskTitle("");
        fetchUserTasks();
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
    
    async function removeTask(taskId) {
      try {
        const currentUser = Parse.User.current();

        await Parse.Cloud.run("removeTask", { taskId: taskId }, { sessionToken: currentUser.getSessionToken() });
        fetchUserTasks();
      } catch (error) {
        console.error("Error removing task:", error);
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
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (editingTask) {
              updateTask(editingTask.objectId, taskTitle, editingTask.completed);
              setShowUpdateTask(false);
            }
          }}
          onKeyDown={e => {
            if (e.key === "Enter") {
              updateTask();
            }
          }}
        >
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
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24, gap: 10 }}>
            <button
              onClick={() => setShowAddTask(true)}
              style={buttonStyle}
            >
              <span style={{ fontSize: 26, fontWeight: "bold", lineHeight: "1" }}>+</span>
              Add
            </button>
            {/* <button
              onClick={() => {
                checkTasks()
                fetchUserTasks()
              }}
              style={buttonStyle}
            >
              Check Tasks Job
            </button> */}
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
                <li key={t.objectId} style={{
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
                      onClick={() => removeTask(t.objectId)}
                    >
                      Delete
                    </button>
                    {
                      t.completed === false ?
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
                          onClick={async () => {
                            updateTask(t.objectId, `${t.title.replace(" (pending task)", "")}`, true)
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
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <h3>Total Tasks: {totalTasks}</h3>
              </div>
            </ul>
          )}
        </div>
        {AddTaskModal}
        {UpdateTaskModal}
      </>
    );
  }

  export default App;