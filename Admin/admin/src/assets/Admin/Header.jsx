import React, { useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import "./header.css";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TextField from '@mui/material/TextField';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
function Header() {
  const toggleSearch = (event) => {
    const searchBarContainer = document.getElementById('searchBarContainer');
  if (searchBarContainer.classList.contains('show')) {
      searchBarContainer.classList.remove('show');
  } else {
      searchBarContainer.style.display = 'block';
      setTimeout(() => { searchBarContainer.classList.add('show'); }, 10);
  }
  };
  const galleryRef = useRef(null);

  const addThemeTransition = () => {
    document.body.classList.add('theme-flash');
    setTimeout(() => {
      document.body.classList.remove('theme-flash');
    }, 300);
  };

  const switchToDark = () => {
    addThemeTransition();
    document.body.classList.add('light-theme');
    document.body.classList.remove('dark-theme');
  };

  const switchToLight = () => {
    addThemeTransition();
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  };

  const scrollGallery = (direction) => {
    const scrollAmount = direction * 200;
    if (galleryRef.current) {
      galleryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const customTheme = (outerTheme) =>
    createTheme({
      palette: {
        mode: outerTheme.palette.mode,
      },
      components: {
        MuiTextField: {
          styleOverrides: {
            root: {
              '--TextField-brandBorderColor': '#E0E3E7',
              '--TextField-brandBorderHoverColor': '#B2BAC2',
              '--TextField-brandBorderFocusedColor': '#6F7E8C',
              '& label': {
                color: 'white', // label color
              },
              '& label.Mui-focused': {
                color: 'var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              color: 'white', // input text
              '& input': {
                color: 'white',
              },
              [`&:hover .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderHoverColor)',
              },
              [`&.Mui-focused .${outlinedInputClasses.notchedOutline}`]: {
                borderColor: 'var(--TextField-brandBorderFocusedColor)',
              },
            },
            notchedOutline: {
              borderColor: 'var(--TextField-brandBorderColor)',
            },
          },
        },
        MuiFilledInput: {
          styleOverrides: {
            root: {
              color: 'white',
              '& input': {
                color: 'white',
              },
              '&::before, &::after': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
        MuiInput: {
          styleOverrides: {
            root: {
              color: 'white',
              '& input': {
                color: 'white',
              },
              '&::before': {
                borderBottom: '2px solid var(--TextField-brandBorderColor)',
              },
              '&:hover:not(.Mui-disabled, .Mui-error):before': {
                borderBottom: '2px solid var(--TextField-brandBorderHoverColor)',
              },
              '&.Mui-focused:after': {
                borderBottom: '2px solid var(--TextField-brandBorderFocusedColor)',
              },
            },
          },
        },
      },
    });
    const outerTheme = useTheme();
  return (
    <>
    <nav>
        <div className="navlogo">
            <a href="../index.html">
            {/* <img className="nlogo mobilevw" src="https://imgs.search.brave.com/v7UNtmlYBaBiX5PR3C2GsMDBTcR10apefd-CsR8EAGU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93MC5w/ZWFrcHguY29tL3dh/bGxwYXBlci81OTYv/NjA0L0hELXdhbGxw/YXBlci1mdWxsLWJs/YWNrLXNjcmVlbi1z/dGFycy10aHVtYm5h/aWwuanBn"/> */}
            </a>
        </div>
        <div className="main">
            <div><a className="n arcade" href="./Foodie.html">Arcade</a></div>
            <div><a className="n sports" href="./Gamez.html">Sports</a></div>
            <div>
                <a className="n profile" href="#" onClick={toggleSearch}>
                <Avatar alt="Remy Sharp" src="https://imgs.search.brave.com/7-LaBSscjvEirI_ZnC6b-6IES5RJEJrm1Zn4h9kKb6U/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9hdmF0/YXJmaWxlcy5hbHBo/YWNvZGVycy5jb20v/MzY4L3RodW1iLTM1/MC0zNjgwNDAud2Vi/cA" /></a>
                <div className="search-bar-container" id="searchBarContainer">
                    <div className="profile_drpdwn ids">
                        <div>Name: THUNDER</div>
                        <div>UID: Thunder3328d</div>
                    </div>
                    <div className="profile_drpdwn">
                        <button className="dark theme" onClick={switchToDark}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-moon-fill" viewBox="0 0 16 16">
  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
</svg></button>
                        <button className="light theme" onClick={switchToLight}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-brightness-high-fill" viewBox="0 0 16 16">
  <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
</svg></button>
                    </div>
                    <div className="profile_drpdwn edit_profile" href="#">Edit Profile<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
</svg></div>
                    <div className="profile_drpdwn prevbook" href="#">Previous Bookings</div>
                    <div className="profile_drpdwn logout" href="#">Logout<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
  <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
</svg></div>
                </div>
            </div>
        </div>
    </nav>
    <div className="container1">
    <div className="location">
        <div href="#"><button className="location_text"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-geo-alt-fill" viewBox="0 0 16 16">
<path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg>Use Current Location</button></div>
        <div className="location_input">
        <ThemeProvider theme={customTheme(outerTheme)}>
        <TextField label="Location" variant="standard" />
        </ThemeProvider>
            <button className="location_btn"><SearchRoundedIcon/></button>
        </div>
    </div>
    <div className="gallery-wrapper">

      <div className="gallery" id="gallery">
          <img src="https://imgs.search.brave.com/J9n21dazrOPrU2ThHeLGrHDWcM9utniR8fpcfDC6UuI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92aXRh/bGVudHVtLm5ldC91/cGxvYWQvMDE2L3Ux/NjIzL2IvNy8xYzRk/MjYwYi53ZWJw"/><img src="https://imgs.search.brave.com/dsOuhL9c52IU6qbQ1qtOgkLtFIrVVN3OnxBp8BmHHjs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly92aXRh/bGVudHVtLm5ldC91/cGxvYWQvMDA0L3U0/MTMvMC8wL2R5bmFt/aWMtc29jY2VyLXBs/YXllci1pbi1hY3Rp/b24tYS12aXZpZC1j/YXB0dXJlLW9mLWlu/dGVuc2l0eS1hbmQt/cHJlY2lzaW9uLXBo/b3RvLXBob3Rvcy1i/aWcud2VicA"/><img src="https://imgs.search.brave.com/ecMIXjQ_L9uMBIJ5kKuBlZ-n7L2nPNFGhAYfdYsp-fg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lYXN5/LXBlYXN5LmFpL2Nk/bi1jZ2kvaW1hZ2Uv/cXVhbGl0eT04MCxm/b3JtYXQ9YXV0byx3/aWR0aD03MDAvaHR0/cHM6Ly9tZWRpYS5l/YXN5LXBlYXN5LmFp/Lzk4YTQ0ODllLTA2/OGUtNDliZS1hM2My/LWZiZjBkMmFjMzg0/Yy8zMTQwZDIwYy05/YjM3LTQ5NzMtYWVh/ZS04MmQ4MGVhODll/ZjcucG5n"/><img src="https://imgs.search.brave.com/BWkMObrEmwTtnv87vZQ3k24keKjCoo6_yA86SM1iZMs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZWYyLnByb21lYWku/cHJvL3Byb2Nlc3Mv/ZG8vOTA1YTQzMzEw/MjIyZjA1NWQxNTY0/ZWQ0OGEyZjFmN2Yu/d2VicD9zb3VyY2VV/cmw9L2cvcC9nYWxs/ZXJ5L3B1Ymxpc2gv/MjAyNC8wOS8wOS9l/YWViYWZlMzM0OGI0/OWIxODE3NzAzMGQw/NjU3ZWI3YS5qcGcm/eC1vc3MtcHJvY2Vz/cz1pbWFnZS9yZXNp/emUsd181MDAsaF81/MDAvZm9ybWF0LHdl/YnAmc2lnbj05ZThj/NTk2OTc4YmQ1YTMz/ZmI2MjRlNDQ1NWQz/NmZmMQ"/>
          <img src="https://imgs.search.brave.com/4s51LpyBFkbOe4TxgiKYuyu7Fr7Y68PwJBfDJtNA7tI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lYXN5/LXBlYXN5LmFpL2Nk/bi1jZ2kvaW1hZ2Uv/cXVhbGl0eT04MCxm/b3JtYXQ9YXV0byx3/aWR0aD03MDAvaHR0/cHM6Ly9tZWRpYS5l/YXN5LXBlYXN5LmFp/LzkzY2EzYTkxLWQx/MjItNDczZi1hZmNj/LWYwZGJkZTYzNjA5/Zi9mOWZmODljNC1m/ZGVlLTQ1ZTAtYjIw/Mi03ZTMxNzUzNjNl/NGYucG5n"/><img src="https://imgs.search.brave.com/gg8kHc0qfuV6j6PqXxGyPXG6vvXvVquUK2rRgtZzG5g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lYXN5/LXBlYXN5LmFpL2Nk/bi1jZ2kvaW1hZ2Uv/cXVhbGl0eT03MCxm/b3JtYXQ9YXV0byx3/aWR0aD0zMDAvaHR0/cHM6Ly9tZWRpYS5l/YXN5LXBlYXN5LmFp/L2U4NTYwNjkxLWJk/MzgtNDhiZi1iZTcz/LWZkYmY4OWE0NTM0/YS83ZmQ3OThhMy01/NDBmLTQ3ZWEtYWUz/NS02NWEwNmQxYTU3/NzQucG5n"/><img src="https://imgs.search.brave.com/XRhUHYceECWp5NmtKSx5yVioMsmC5fS4WY9XM8au1j4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZWYyLnByb21lYWku/cHJvL3Byb2Nlc3Mv/ZG8vY2YzMWYzOGMz/YjlhMTM1Yzg2MDFj/ODJlNzM0NjIxYTgu/d2VicD9zb3VyY2VV/cmw9L2cvcC9nYWxs/ZXJ5L3B1Ymxpc2gv/MjAyNC8wOS8xNy9k/OThlMDlmYzM1YmM0/ZmQwYTAxMGNmMDVi/ZTYzYTAwZC5qcGcm/eC1vc3MtcHJvY2Vz/cz1pbWFnZS9yZXNp/emUsd181MDAsaF81/MDAvZm9ybWF0LHdl/YnAmc2lnbj0zMTIy/MDRmNjYyNWM1NThm/NzA1NjMzOTRlMjJi/ZDQxMw"/><img src="https://imgs.search.brave.com/pqK6Brxu4m12ACI1vXPxCVfTPv83GWrR5rJlKCK_wyM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9lYXN5/LXBlYXN5LmFpL2Nk/bi1jZ2kvaW1hZ2Uv/cXVhbGl0eT03MCxm/b3JtYXQ9YXV0byx3/aWR0aD0zMDAvaHR0/cHM6Ly9tZWRpYS5l/YXN5LXBlYXN5LmFp/Lzc4MTcwMzA1LTQz/YjQtNDQ0NS05YWUx/LTAwMjM2ODEwNjA4/NC9mNjAzMDc1Ni05/NDdmLTQ3M2EtOWIx/OC0wOGFiMzMyMTIy/YzcucG5n"/>
      </div>
    </div>
</div>

</>
  );
}

export default Header;