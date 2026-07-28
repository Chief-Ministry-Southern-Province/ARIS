<?php

namespace App\Services\PDF\Contracts;
use Symfony\Component\HttpFoundation\Response;

interface PdfGeneratorInterface
{
    public function download(int $documentId): Response;

    public function stream(int $documentId): Response;
}