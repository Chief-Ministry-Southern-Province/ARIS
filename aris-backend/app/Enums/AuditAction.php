<?php

namespace App\Enums;

enum AuditAction: string
{
    case CREATE = 'CREATE';
    case UPDATE = 'UPDATE';
    case DELETE = 'DELETE';

    case LOGIN = 'LOGIN';
    case LOGOUT = 'LOGOUT';

    case SUBMIT = 'SUBMIT';

    case APPROVE = 'APPROVE';
    case REJECT = 'REJECT';
    case RETURN = 'RETURN';
    case RECOMMEND = 'RECOMMEND';

    case ASSIGN = 'ASSIGN';

    case UPLOAD = 'UPLOAD';
    case DOWNLOAD = 'DOWNLOAD';

    case PRINT = 'PRINT';
    case EXPORT = 'EXPORT';

    case RESTORE = 'RESTORE';
}