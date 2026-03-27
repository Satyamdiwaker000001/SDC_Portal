export default function Login() {
  return (
    <>
        <section>
            <form>
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" required />
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" required />
                <button type="submit">Login</button>
            </form>
        </section>    
    </>
  );
}