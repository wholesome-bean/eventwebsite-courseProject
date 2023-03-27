import Link from 'next/link'
import Image from 'next/image'

const Navbar = () => {
    return (
        <nav>
            <div className="logo">
                <Image src="/logo.png" width = {128} height={77} alt=''/>
            </div>
            <Link href ="/">Home</Link>
            <Link href ="/events">Events</Link>
            <Link href ="/rso">Organizations</Link>
        </nav>
    );
}

export default Navbar;