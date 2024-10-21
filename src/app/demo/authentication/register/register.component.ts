// angular import
// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [RouterModule],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.scss']
// })
// export default class RegisterComponent {
//   // public method
//   SignUpOptions = [
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
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export default class RegisterComponent {
  // Form data
  userName: string = '';
  password: string = '';
  designation: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Method to handle form submission
  register(formData: { userName: string; password: string; designation: string }) {
    const url = 'http://3.13.197.45/:8080/user/sign-up';
    const body = {
      username: formData.userName,
      password: formData.password,
      designation: formData.designation
    };

    this.http.post(url, body).subscribe(
      (response) => {
        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
        // Handle successful registration, e.g., navigate to login page
      },
      (error) => {
        console.error('Registration failed:', error);
        // Handle registration error
      }
    );
  }
}

