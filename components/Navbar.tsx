import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
return (
<nav style={{ display: 'flex', justifyContent: 'center' }}>
<Link href="/">Log in/out</Link>
<Link href="/profile">Profile</Link>
<Link href="/events">Events</Link>
<Link href="/rso">Organizations</Link>
</nav>
);
}

export default Navbar;