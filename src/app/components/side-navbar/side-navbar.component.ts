import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit {
  menuList =  [
    {
      text: 'Dashboard',
      icon: 'dashboard',
      routerLink: '/usit/dashboard',
    },
    {
      text: 'RSS Feed',
      icon: 'rss_feed',
      routerLink: '/usit/rss-feed',
    },
    {
      text: 'Open Reqs',
      icon: 'open_in_new',
      routerLink: '/usit/open-reqs',
    },


    {
      text: 'VMS',
      icon: 'work',
      children: [
        {
          text: 'Vendor',
          icon: 'people',
          routerLink: '/usit/vendor',
        },
        {
          text: 'Recruiters',
          icon: 'business_center',
          routerLink: '/usit/recruiters',
        },
      ],
    },
    {
      text: 'Tech & Support',
      icon: 'people',
      routerLink: '/usit/tech-spport',
    },
    {
      text: 'Immigration',
      icon: 'people',
      routerLink: '/usit/immigration',
    },
    {
      text: 'Inbox',
      icon: 'inbox',
      routerLink: '/usit/inbox',
    },
    {
      text: 'Email Extraction',
      icon: 'email',
      routerLink: '/usit/email-extraction',
    },

    {
      text: 'Employees',
      icon: 'people',
      routerLink: '/usit/employess',
    },
    {
      text: 'LinkedIn Profiles',
      icon: 'people',
      routerLink: '/usit/linkedin-profiles',
    },
    {
      text: 'Pre-sales',
      icon: 'people',
      routerLink: '/usit/pre-sales',
    },
    {
      text: 'H1-Transfer',
      icon: 'people',
      routerLink: '/usit/h1-transfer',
    },
    {
      text: 'Sales',
      icon: 'attach_money',
      children: [
        {
          text: 'Team Profiles',
          icon: 'people',
          routerLink: '/usit/team-profiles',
        },
        {
          text: 'Consultants',
          icon: 'person',
          routerLink: '/usit/consultants',
        },
        {
          text: 'Submissions',
          icon: 'person',
          routerLink: '/usit/submissions',
        },
        {
          text: 'Interviews',
          icon: 'person',
          routerLink: '/usit/interviews',
        },
      ],
    },
    {
      text: 'Recruitment',
      icon: 'business',
      children: [
        {
          text: 'Requirements',
          icon: 'business',
          routerLink: '/usit/req',
        },
        {
          text: 'Consultants',
          icon: 'person_search',
          routerLink: '/usit/consultants',
        },
        {
          text: 'Submissions',
          icon: 'assignment',
          routerLink: '/usit/subm',
        },
        {
          text: 'Interviews',
          icon: 'chat_bubble_outline',
          routerLink: '/usit/iv',
        },
      ],
    },
    {
      text: 'Roles',
      icon: 'assignment_ind',
      routerLink: '/usit/roles',
    },
    {
      text: 'Register Privilage',
      icon: 'vpn_key',
      routerLink: '/usit/reg-previlage',
    },
    // {
    //   text: 'Assign Consultant',
    //   icon: 'assignment',
    //   routerLink: '/usit/assign-consultant',
    // },
    {
      text: 'Reports',
      icon: 'description',
      children: [
        {
          text: 'Employee Performance',
          icon: 'bar_chart',
          routerLink: '/usit/emp-perf',
        },
        {
          text: 'Sourcing Interviews',
          icon: 'assessment',
          routerLink: '/usit/source-interviews',
        },

      ],
    },
    {
      text: 'Masters',
      icon: 'extension',
      children: [
        {
          text: 'Visa',
          icon: 'credit_card',
          routerLink: '/usit/visa',
        },
        {
          text: 'Qualification',
          icon: 'school',
          routerLink: '/usit/qualification',
        },
        {
          text: 'Companies',
          icon: 'business',
          routerLink: '/usit/companies',
        },
        {
          text: 'Administration Files',
          icon: 'description',
          routerLink: '/usit/admin-files',
        },
      ],
    },
    {
      text: 'Create PO',
      icon: 'note_add',
      routerLink: '/usit/create-po',
    },
    {
      text: 'HR',
      icon: 'description',
      children: [
        {
          text: 'HR Performance',
          icon: 'bar_chart',
          routerLink: '/usit/emp-perf',
        },
        {
          text: 'HR Interviews',
          icon: 'assessment',
          routerLink: '/usit/source-interviews',
        },

      ],
    },
  ];


  ngOnInit(): void {

  }


}
