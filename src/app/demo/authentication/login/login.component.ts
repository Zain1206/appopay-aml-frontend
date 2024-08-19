// // angular import
// import { Component } from '@angular/core';
// import { Router, RouterModule } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [RouterModule, FormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export default class LoginComponent {
//   userName: string = '';
//   password: string = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   onLogin() {
//     this.authService.login(this.userName, this.password).subscribe({
//       next: (response) => {
//         console.log('Login successful', response);
//         // Handle successful login, e.g., storing JWT token
//         this.router.navigate(['/dashboard']);
//       },
//       error: (error) => {
//         console.error('Login failed', error);
//         // Handle login error, e.g., show error message to the user
//       }
//     });
//   }
//   // public method
//   SignInOptions = [
//     {
//       image: 'assets/images/authentication/google.svg',
//       name: 'Google'
//     },
//     {
//       image: 'assets/images/authentication/twitter.svg',
//       name: 'Twitter'
//     },
//     {
//       image: 'assets/images/authentication/facebook.svg',
//       name: 'Facebook'
//     }
//   ];

// }

import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  userName: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    console.log('Attempting login with:', {
      userName: this.userName,
      password: this.password
    });

    this.authService.login(this.userName, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/dashboard/default']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  SignInOptions = [
    {
      image: 'assets/images/authentication/google.svg',
      name: 'Google'
    },
    {
      image: 'assets/images/authentication/twitter.svg',
      name: 'Twitter'
    },
    {
      image: 'assets/images/authentication/facebook.svg',
      name: 'Facebook'
    }
  ];
}

