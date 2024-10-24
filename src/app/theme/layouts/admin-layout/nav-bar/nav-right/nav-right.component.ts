// angular import
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';


// icon
import { IconService } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline,
  KeyOutline,
  CodepenCircleOutline,
  PercentageOutline,
  TransactionOutline,
  SwapOutline
} from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-nav-right',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  @Input() styleSelectorToggle!: boolean;
  @Output() Customize = new EventEmitter();
  windowWidth: number;
  screenFull: boolean = true;
  username: string | null = '';

  constructor(private iconService: IconService, private router: Router) {
    this.windowWidth = window.innerWidth;
    this.username = localStorage.getItem('username');
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline,
        KeyOutline,
        CodepenCircleOutline,
        PercentageOutline,
        TransactionOutline,
        SwapOutline
      ]
    );
  }

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('totalMerchants');
    localStorage.removeItem('totalAgents');
    localStorage.removeItem('totalCustomers');
    this.router.navigate(['/login']); // Redirect to login page
  }
  
  profile = [
 
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Support'
    },
    {
      icon: 'user',
      title: 'Account Settings'
    },
    {
      icon: 'lock',
      title: 'Privacy Center'
    },
    {
      icon: 'comment',
      title: 'Feedback'
    },
    {
      icon: 'unordered-list',
      title: 'History'
    }
  ];
}
