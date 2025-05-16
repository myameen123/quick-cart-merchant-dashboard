import { AlignJustify } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import Menu from './Menu';


const Header = () => {
  return (
    <header>
      <nav>
        <div className='navbar flex justify-between bg-white shadow-sm border px-6 py-3'>
          <div>
            <Link href='/signin' className='w-full'>
              <Image src='/Quick-Checkout.svg' alt='logo' width={150} height={100} />
            </Link>
          </div>
          <Menu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
