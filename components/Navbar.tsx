import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
return (
<nav style={{ display: 'flex', justifyContent: 'center' }}>
<Link href="/">Home</Link>
<Link href="/events">Events</Link>
<Link href="/rso">Organizations</Link>
</nav>
);
}

export default Navbar;