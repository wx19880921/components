/**
* Just define settings or constant constiable here
* No dependency
*/
export const TMMS_WEB_ROOT = '/api/v1/'; 
export const TMMS_SESSION_KEY = 'username';
export const TMMS_MAX_PAGE_LIMIT = 999999;
export const VMI_LANGUAGE_POLICY_ID = 40;
export const VMI_WALLPAPER_POLICY_ID = 50;
export const VMI_MAGIC_CODE = '#$vmi4trend';

// show navagation item
// 
 const navigation = {
	children:	[
		{
			id:	 		1,
			title:		"Dashboard",
			url:		"#/dashboard/usage",
			status:		"show",
			children:	[
				{	id:			11,
					title:		"Usage Overview",
					url:		"#/dashboard/usage",
					status:		"show",
					children:	[]
				},   
				{
					id:			12,
					title:		"System Status",
					url:		"#/dashboard/system",
					status:		"show",
					children:	[]
				},
			]
		},
		{
			id:			2,
			title:		"Users",
			url:		"#/user/users",
			status:		"show",
			children:	[
				{	id:		21,
					title:		"Users",
					url:		"#/user/users",
					status:		"show",
					children:	[]
				},   
				{
					id:			22,
					title:		"Devices",
					url:		"../apps/local_app.htm",
					status:		"show",
					children:	[]
				},
			]
		},
		{
			id:			3,
			title:		"Profiles",
			url:		"#/profiles",
			status:		"show",
			showchild:	"none",
			children:	[
			    { 
					id:			31,
					title:		"Edit Profile",
					url:		"#/profiles/edit",
					status:		"show",
					children:	[]
				},
				{
					id:			32,
					title:		"Create Profile",
					url:		"#/profiles/create",
					status:		"show",
					children:	[]
				},
			]
		},
		{
			id:			4,
			title:		"Applications",
			url:		"#/applications/app",
			status:		"show",
			children:	[
			    { 
					id:			41,
					title:		"Applications",
					url:		"#/applications/app",
					status:		"show",
					children:	[]
				},
				{
					id:			42,
					title:		"Local Applications",
					url:		"#/applications/localapp",
					status:		"show",
					children:	[]
				},
				{
					id:			43,
					title:		"Wallpaper Management",
					url:		"#/applications/wallpaper",
					status:		"show",
					children:	[]
				}
			]
		},
		{
			id:			5,
			title:		"Servers",
			url:		"#/servers",
			status:		"show",
			showchild:	"none",
			children:	[
				{ 
					id:			51,
					title:		"View Server",
					url:		"#/servers/viewpro",
					status:		"hide",
					children:	[]
				},
				{ 
					id:			52,
					title:		"Edit Server",
					url:		"#/servers/edit",
					status:		"hide",
					children:	[]
				},
			]
		},
		{
			id:			7,
			title:		"Reports",
			url:		null,
			status:		"show",
			children:	[
                {
                    id:         71,
					title:		"Reports",
					url:		"../reports/index.htm",
                    status:     "show",
                    children:   []
                },
                {
                    id:         72,
					title:		"Logs",
					url:		"../reports/log.htm",
                    status:     "show",
                    children:   []
                }
			]
		},
		{
			id:			9,
			title:		"System Settings",
			url:		"#/systemsetting/ldap",
			status:		"show",
			children:	[
                {
                    id:         91,
                    title:      "LDAP",
                    url:        "#/systemsetting/ldap",
                    status:     "show",
                    children:   []
                },
                {
                    id:         92,
                    title:      "Mobile Client",
                    url:        "#/systemsetting/mobileclient",
                    status:     "show",
                    children:   []
                },
                {
                    id:         93,
                    title:      "Exchange Server",
                    url:        "#/systemsetting/exchangeserver",
                    status:     "show",
                    children:   []
                },
                {
                    id:         94,
                    title:      "Proxy",
                    url:        "#/systemsetting/proxy",
                    status:     "show",
                    children:   []
                },
                {
                    id:         95,
                    title:      "Syslog",
                    url:        "#/systemsetting/syslog",
                    status:     "show",
                    children:   []
                },
                {
                    id:         96,
                    title:      "Advanced",
                    url:        "#/systemsetting/advanced",
                    status:     "show",
                    children:   []
                },
			]
		},
		{
			id:			6,
			title:		"Administration",
			url:		null,
			status:		"show",
			children:	[
                {
                    id:         61,
                    title:      "My Account",
                    url:        "../administration/admin_profile.htm",
                    status:     "show",
                    children:   []
                },
				{
					id:			62,
					title:		"Email Notifications",
					url:		"../administration/email.htm",
					status:		"show",
					children:	[]
				},
				{
					id:			68,
					title:		"Certificate Management",
					url:		"../administration/cert.htm",
					status:		"show",
					children:	[]
				},
				{
					id:			65,
					title:		"Access Management",
					url:		"../administration/access.htm",
					status:		"hide",
					children:	[]
				},
                {
                    id:         66,
                    title:      "Product License",
                    url:        "../administration/license.htm",
                    status:     "show",
                    children:   []
                },
                {
                    id:         67,
                    title:      "About",
                    url:        "../administration/about.htm",
                    status:     "show",
                    children:   []
                }
			]
		},
		{
			id:			8,
			title:		"Help",
			url:		"../help/index.html",
			status:		"show",
			linktarget: "_blank",
			children:	[]
		}

	]
};


export default navigation;