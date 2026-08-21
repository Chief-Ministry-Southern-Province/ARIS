<?php

return [
    'prefix' => 'CMSP',
    'sector' => 'HLTH',

    'districts' => [
        'galle' => 'GAL',
        'matara' => 'MAT',
        'hambantota' => 'HAM',
    ],

    // Base Hospitals are separate coding groups rather than PDHS head-office cases.
    'base_hospitals' => [
        'teaching hospital karapitiya' => 'KAR',
        'base hospital balapitiya' => 'BAL',
        'base hospital elpitiya' => 'ELP',
        'base hospital kamburupitiya' => 'KAM',
        'base hospital tangalle' => 'TAN',
    ],
];
