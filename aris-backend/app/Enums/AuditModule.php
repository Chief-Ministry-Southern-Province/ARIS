<?php

namespace App\Enums;

enum AuditModule: string
{
    case AUTH = 'Authentication';

    case USERS = 'Users';
    case ROLES = 'Roles';
    case PERMISSIONS = 'Permissions';

    case INSTITUTIONS = 'Institutions';

    case VEHICLES = 'Vehicles';

    case ACCIDENTS = 'Accidents';

    case EVIDENCE = 'Evidence';

    case INVESTIGATION = 'Investigation';

    case FR1043 = 'FR1043';

    case FR1044 = 'FR1044';

    case FR109 = 'FR109';

    case APPROVAL = 'Approval';

    case WORKFLOW = 'Workflow';

    case DASHBOARD = 'Dashboard';
}