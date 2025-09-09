import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const DataPreview = ({ previewData, onProcessUpload, isProcessing }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  if (!previewData || previewData?.length === 0) return null;

  const totalPages = Math.ceil(previewData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = previewData?.slice(startIndex, endIndex);

  const columns = [
    { key: 'LOCO_NO', label: 'LOCO NO', width: 'w-32' },
    { key: 'ZONE', label: 'ZONE', width: 'w-20' },
    { key: 'SHED_NAME', label: 'SHED NAME', width: 'w-32' },
    { key: 'UNIT_SR_NO', label: 'UNIT SR NO', width: 'w-28' },
    { key: 'DOC', label: 'DOC', width: 'w-28' },
    { key: 'OUT_OF_WARRANTY', label: 'Warranty', width: 'w-24' },
    { key: 'LOCO_TYPE', label: 'LOCO TYPE', width: 'w-28' },
    { key: 'CONVERTER_TYPE', label: 'CONVERTER', width: 'w-28' },
    { key: 'DBR_TYPE', label: 'DBR TYPE', width: 'w-28' },
    { key: 'MOTHER_BOARD_MOD', label: 'MB Mod', width: 'w-24' },
    { key: 'VOLTAGE_SENSOR', label: 'VS Card', width: 'w-24' },
    { key: 'BUZZER_MOD', label: 'Buzzer', width: 'w-24' },
    { key: 'PS_MOD', label: 'PS Mod', width: 'w-24' },
    { key: 'FLASHER_SW_MOD', label: 'Flasher', width: 'w-24' },
    { key: 'SIM_CHANGING', label: 'SIM Change', width: 'w-28' },
    { key: 'SIM_1_NO', label: 'SIM 1', width: 'w-32' },
    { key: 'SIM_2_NO', label: 'SIM 2', width: 'w-32' }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range?.push(i);
    }
    return range;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, previewData?.length)} of {previewData?.length} records
          </p>
        </div>
        <Button
          variant="default"
          onClick={onProcessUpload}
          loading={isProcessing}
          iconName="Upload"
          iconPosition="left"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Process Upload'}
        </Button>
      </div>
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-3 text-sm font-medium text-muted-foreground w-16">
                #
              </th>
              {columns?.map((column) => (
                <th
                  key={column?.key}
                  className={`text-left p-3 text-sm font-medium text-muted-foreground ${column?.width}`}
                >
                  {column?.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData?.map((row, index) => (
              <tr key={startIndex + index} className="border-b border-border hover:bg-muted/50">
                <td className="p-3 text-sm text-muted-foreground">
                  {startIndex + index + 1}
                </td>
                {columns?.map((column) => (
                  <td key={column?.key} className="p-3 text-sm text-foreground">
                    <div className="truncate" title={row?.[column?.key]}>
                      {row?.[column?.key] || '-'}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {currentData?.map((row, index) => (
          <div key={startIndex + index} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-primary">
                Record #{startIndex + index + 1}
              </span>
              <span className="text-xs text-muted-foreground">
                {row?.LOCO_NO}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Zone:</span>
                <span className="ml-2 text-foreground">{row?.ZONE || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Shed:</span>
                <span className="ml-2 text-foreground">{row?.SHED_NAME || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 text-foreground">{row?.LOCO_TYPE || '-'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">DOC:</span>
                <span className="ml-2 text-foreground">{row?.DOC || '-'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconSize={16}
              className="w-8 h-8 p-0"
            />
            
            {getPaginationRange()?.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconSize={16}
              className="w-8 h-8 p-0"
            />
          </div>
        </div>
      )}
      {/* Summary Stats */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-foreground">{previewData?.length}</p>
            <p className="text-xs text-muted-foreground">Total Records</p>
          </div>
          <div>
            <p className="text-lg font-bold text-success">
              {previewData?.filter(row => row?.OUT_OF_WARRANTY === 'No')?.length}
            </p>
            <p className="text-xs text-muted-foreground">In Warranty</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning">
              {previewData?.filter(row => row?.OUT_OF_WARRANTY === 'Yes')?.length}
            </p>
            <p className="text-xs text-muted-foreground">Out of Warranty</p>
          </div>
          <div>
            <p className="text-lg font-bold text-primary">
              {new Set(previewData.map(row => row.ZONE))?.size}
            </p>
            <p className="text-xs text-muted-foreground">Unique Zones</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPreview;